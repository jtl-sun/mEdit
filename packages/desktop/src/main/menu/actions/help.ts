import { type BrowserWindow } from 'electron'

export const showAboutDialog = (win: BrowserWindow | null | undefined): void => {
  if (win && win.webContents) {
    win.webContents.send('mt::about-dialog')
  }
}

export const showMarkdownGuide = (win: BrowserWindow | null | undefined): void => {
  if (win && win.webContents) {
    win.webContents.send('mt::markdown-guide-dialog')
  }
}
