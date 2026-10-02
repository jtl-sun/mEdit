import { expect, test } from '@playwright/test'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve, join } from 'node:path'
import type { ElectronApplication, Page } from 'playwright'
import { launchElectron, sendIpcToRenderer, enterSourceMode, exitSourceMode } from './helpers'

const tabs = '.tabs-container > li'

const setPreferences = (app: ElectronApplication, values: Record<string, unknown>) =>
  sendIpcToRenderer(app, 'mt::user-preference', values)

const clickFileMenu = (app: ElectronApplication, label: string) =>
  app.evaluate(({ Menu, BrowserWindow }, text) => {
    const item = Menu.getApplicationMenu()?.items
      .find((menu) => menu.label === 'File')?.submenu?.items
      .find((entry) => entry.label === text)
    if (!item) throw new Error(`Missing File menu item: ${text}`)
    item.click(undefined, BrowserWindow.getAllWindows()[0], undefined)
  }, label)

const width = (page: Page, selector: string) => page.locator(selector).evaluate((element) => ({
  width: element.getBoundingClientRect().width,
  parent: element.parentElement!.getBoundingClientRect().width,
  maxWidth: getComputedStyle(element).maxWidth
}))

test('full-width text survives theme changes, resizing and switching editing modes', async() => {
  const { app, page } = await launchElectron()
  try {
    await page.locator('.mu-container').waitFor()
    await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setSize(1800, 900))
    for (const theme of ['light', 'dark', 'nord']) {
      await setPreferences(app, { theme, editorLineWidth: '' })
      await expect.poll(async() => {
        const measured = await width(page, '.mu-container')
        return Math.abs(measured.width - measured.parent)
      }).toBeLessThan(2)
    }
    await setPreferences(app, { editorLineWidth: '800px' })
    await expect.poll(async() => (await width(page, '.mu-container')).width).toBeCloseTo(848, 0)
    const narrow = await width(page, '.mu-container')
    await setPreferences(app, { editorLineWidth: '1600px' })
    await expect.poll(async() => (await width(page, '.mu-container')).width).toBeGreaterThan(narrow.width + 200)
    await enterSourceMode(page, app)
    await expect.poll(async() => (await width(page, '.source-code .CodeMirror')).maxWidth).toBe('1648px')
    await setPreferences(app, { editorLineWidth: '100%' })
    await expect.poll(async() => {
      const measured = await width(page, '.source-code .CodeMirror')
      return Math.abs(measured.width - measured.parent)
    }).toBeLessThan(2)
    await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setSize(700, 700))
    await setPreferences(app, { editorLineWidth: '1600px' })
    await expect.poll(async() => {
      const measured = await width(page, '.source-code .CodeMirror')
      return measured.width - measured.parent
    }).toBeLessThan(2)
    await exitSourceMode(page, app)
    await expect.poll(async() => {
      const measured = await width(page, '.mu-container')
      return Math.abs(measured.width - measured.parent)
    }).toBeLessThan(2)
  } finally {
    await app.close()
  }
})

test('New File and Close File work with the first and last documents', async() => {
  const { app, page } = await launchElectron()
  try {
    await expect(page.locator(tabs)).toHaveCount(1)
    await expect(page.locator('.editor-tabs')).toBeVisible()
    await expect(page.locator('.close-icon')).toBeVisible()
    const initialId = await page.locator(tabs).getAttribute('data-id')
    await clickFileMenu(app, 'New File')
    await expect(page.locator(tabs)).toHaveCount(2)
    await clickFileMenu(app, 'Close File')
    await expect(page.locator(tabs)).toHaveCount(1)
    await page.locator('.close-icon').click()
    await expect(page.locator(tabs)).toHaveCount(1)
    await expect(page.locator(tabs)).not.toHaveAttribute('data-id', initialId!)
    await expect(page.locator('.mu-editor')).toHaveText('')
  } finally {
    await app.close()
  }
})

test('Preferences displays the default width preset and applies presets and custom values', async() => {
  const { app, page } = await launchElectron()
  try {
    const settingsWindow = app.waitForEvent('window')
    await clickFileMenu(app, 'Preferences')
    const settings = await settingsWindow
    await settings.locator('.pref-sidebar .category .item').filter({ hasText: /^Editor$/ }).click()
    const preset = settings.locator('.pref-select-item').filter({ hasText: 'Editor Width Preset' })
    await expect(preset).toContainText('Full Window (Default)')
    await preset.locator('.el-select').click()
    await settings.locator('.el-select-dropdown__item').filter({ hasText: 'Wide (1600px)' }).click()
    await expect.poll(async() => (await width(page, '.mu-container')).maxWidth).toBe('1648px')
    const custom = settings.locator('.pref-text-box-item').filter({ hasText: 'Editor Width' })
    await custom.locator('input').fill('80ch')
    await expect.poll(() => page.locator('.editor-component').evaluate((element) =>
      getComputedStyle(element).getPropertyValue('--editor-area-width').trim()
    )).toBe('calc(48px + 80ch)')
    await expect(preset).toContainText('Approximately 80 Characters')
    await preset.locator('.el-select').click()
    await settings.locator('.el-select-dropdown__item').filter({ hasText: 'Full Window (Default)' }).click()
    await expect.poll(async() => {
      const measured = await width(page, '.mu-container')
      return Math.abs(measured.width - measured.parent)
    }).toBeLessThan(2)
  } finally {
    await app.close()
  }
})

test('upgrade starts blank, preserves unsaved recovery data and permits opting into restore', async() => {
  const userDataDir = mkdtempSync(join(tmpdir(), 'medit-startup-'))
  const preferencesFile = join(userDataDir, 'preferences.json')
  const preferences = JSON.parse(readFileSync(resolve('static/preference.json'), 'utf8'))
  writeFileSync(preferencesFile, JSON.stringify({
    ...preferences,
    startUpAction: 'restoreAll',
    tabBarVisibility: false,
    __internal__: { migrations: { version: '0.21.10' } }
  }))
  mkdirSync(join(userDataDir, 'editorStates'))
  const bufferFile = join(userDataDir, 'editorStates', 'prior_editor_buffer_store.json')
  const buffer = JSON.stringify({
    version: 1,
    tabs: [{ id: 'prior-tab', pathname: '', filename: 'Untitled-1', markdown: 'Unsaved recovery text', isSaved: false }],
    currentFileId: 'prior-tab'
  })
  writeFileSync(bufferFile, buffer)
  const first = await launchElectron([], { userDataDir })
  try {
    await expect(first.page.locator(tabs)).toHaveCount(1)
    await expect(first.page.locator('.editor-tabs')).toBeVisible()
    await expect(first.page.locator('.mu-editor')).toHaveText('')
    expect(JSON.parse(readFileSync(preferencesFile, 'utf8')).startUpAction).toBe('blank')
    expect(readFileSync(bufferFile, 'utf8')).toBe(buffer)
  } finally {
    await first.app.close()
  }
  // Remove only saved blank buffers created by the first test launch.
  for (const name of readdirSync(join(userDataDir, 'editorStates'))) {
    if (name === 'prior_editor_buffer_store.json' || !name.endsWith('_editor_buffer_store.json')) continue
    const filename = join(userDataDir, 'editorStates', name)
    const saved = JSON.parse(readFileSync(filename, 'utf8'))
    if (saved.tabs.every((tab: { isSaved: boolean }) => tab.isSaved)) unlinkSync(filename)
  }
  const upgraded = JSON.parse(readFileSync(preferencesFile, 'utf8'))
  writeFileSync(preferencesFile, JSON.stringify({ ...upgraded, startUpAction: 'restoreAll' }))
  const second = await launchElectron([], { userDataDir })
  try {
    await expect(second.page.locator('.mu-editor')).toContainText('Unsaved recovery text')
    expect(JSON.parse(readFileSync(preferencesFile, 'utf8')).startUpAction).toBe('restoreAll')
    await second.app.evaluate(({ dialog }) => {
      dialog.showMessageBox = async() => ({ response: 1, checkboxChecked: false })
    })
    await clickFileMenu(second.app, 'Close File')
    await expect(second.page.locator('.mu-editor')).toHaveText('')
    await expect(second.page.locator(tabs)).toHaveCount(1)
  } finally {
    await second.app.close()
  }
})
