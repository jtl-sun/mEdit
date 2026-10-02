import { describe, it, expect, vi, afterEach } from 'vitest'

const mockApp = vi.hoisted(() => ({ isPackaged: false, getAppPath: () => '/app' }))
vi.mock('electron', () => ({ app: mockApp }))
vi.mock('common/filesystem', () => ({ isDirectory: () => false }))
vi.mock('../../../src/main/utils', () => ({ getPath: () => '/data' }))

import cli from '../../../src/main/cli'

const originalArgv = process.argv
afterEach(() => {
  process.argv = originalArgv
})

describe('startup file arguments', () => {
  it('ignores the Electron application entry path when no file is requested', () => {
    mockApp.isPackaged = false
    process.argv = ['electron', '/app', '--user-data-dir', '/profile']
    expect(cli()._).toEqual([])
  })
  it('retains explicit file arguments in an unpackaged launch', () => {
    mockApp.isPackaged = false
    process.argv = ['electron', '/app', '/notes.md']
    expect(cli()._).toEqual(['/notes.md'])
  })
  it('retains the first file argument in packaged Windows and Ubuntu launches', () => {
    mockApp.isPackaged = true
    process.argv = ['mEdit', '/notes.md', '/second.txt']
    expect(cli()._).toEqual(['/notes.md', '/second.txt'])
  })
})
