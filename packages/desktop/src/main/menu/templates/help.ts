import type { BrowserWindow, MenuItemConstructorOptions } from 'electron'
import * as actions from '../actions/help'
import { t } from '../../i18n'

export default function(): MenuItemConstructorOptions {
  return {
    label: t('menu.help.help'),
    role: 'help',
    submenu: [
      {
        label: 'Markdown 빠른 안내서',
        click(_menuItem, browserWindow) {
          actions.showMarkdownGuide(browserWindow as BrowserWindow | undefined)
        }
      },
      {
        type: 'separator'
      },
      {
        label: t('menu.help.about'),
        click(_menuItem, browserWindow) {
          actions.showAboutDialog(browserWindow as BrowserWindow | undefined)
        }
      }
    ]
  }
}
