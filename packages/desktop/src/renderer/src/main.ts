import { createApp, type App } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import bootstrapRenderer from './bootstrap'
import axios from './axios'
import pinia from './store'
import './assets/symbolIcon'

// Element Plus instead of Element UI for Vue 3
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import en from 'element-plus/es/locale/lang/en'

// I18n translation system
import i18nPlugin from './i18n'

// something is wrong here! \/
import services from './services/index'
import routes from './router'
import Main from './Main.vue'

import './assets/styles/index.css'
import './assets/styles/printService.css'

// -----------------------------------------------

window.marktext = {}
bootstrapRenderer()

// Keep the native desktop title visible on Linux/Windows. The editor updates
// document.title when files change; normalize every update so an empty title
// never leaves the window decoration blank and the mEDIT brand stays visible.
const APP_WINDOW_TITLE = 'mEDIT'
const syncWindowTitle = (): void => {
  const currentTitle = document.title.trim()
  let nextTitle = APP_WINDOW_TITLE

  if (currentTitle && currentTitle !== APP_WINDOW_TITLE) {
    const detail = currentTitle.replace(/^mEDIT\s+[—-]\s+/, '').trim()
    if (detail) {
      nextTitle = `${APP_WINDOW_TITLE} — ${detail}`
    }
  }

  if (document.title !== nextTitle) {
    document.title = nextTitle
  }
}

syncWindowTitle()
const titleElement = document.querySelector('title')
if (titleElement) {
  const titleObserver = new MutationObserver(syncWindowTitle)
  titleObserver.observe(titleElement, {
    childList: true,
    subtree: true,
    characterData: true
  })
}

// -----------------------------------------------
// Be careful when changing code before this line!

// Create Vue app
const app: App<Element> = createApp(Main)

// Configure Element Plus with locale
app.use(ElementPlus, {
  locale: en
})

const envType = window.marktext?.env?.type as string | undefined

const router = createRouter({
  history: createWebHashHistory(),
  // it seems like something might have changed in vue-router? it uses the full "file path" instead of
  // links like /editor if we use the old createWebHistory()
  routes: routes(envType)
})

app.use(router)
app.use(pinia)
app.use(i18nPlugin)

// Configure axios globally
app.config.globalProperties.$http = axios

// Register services globally
;(services as unknown as Array<Record<string, unknown> & { name: string }>).forEach((s) => {
  app.config.globalProperties['$' + s.name] = s[s.name]
})

// Mount the app
app.mount('#app')
