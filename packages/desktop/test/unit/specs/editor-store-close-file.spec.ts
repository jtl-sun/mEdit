import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

// `@/store/editor` transitively imports `@/config`, which reads
// `window.path.sep` at module load (normally injected by the preload bridge).
// It also reaches `window.electron.clipboard` / `window.electron.ipcRenderer`
// at runtime. Stub the surfaces before the hoisted imports run.
vi.hoisted(() => {
  const w = globalThis as unknown as {
    window?: {
      path?: { sep: string; dirname: (p: string) => string }
      electron?: {
        clipboard: { writeText: (s: string) => void }
        ipcRenderer: { send: (...a: unknown[]) => void; on: (...a: unknown[]) => void }
      }
    }
  }
  w.window ??= {}
  w.window.path ??= { sep: '/', dirname: (p: string) => p }
  w.window.electron ??= {
    clipboard: { writeText: () => {} },
    ipcRenderer: { send: () => {}, on: () => {} }
  }
})

// The notification service touches the DOM / template HTML; stub it so we can
// observe `notify` without rendering a toast.
vi.mock('@/services/notification', () => ({
  default: { notify: vi.fn(), name: 'notify' }
}))

vi.mock('@/store/bufferedState', () => ({
  debouncedSendBufferedState: vi.fn(), sendBufferedState: vi.fn()
}))

import { useEditorStore } from '@/store/editor'
import { usePreferencesStore } from '@/store/preferences'
import bus from '@/bus'

describe('Close File', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })
  it('starts with a blank file and visible tabs by default', () => {
    const preferences = usePreferencesStore()
    expect(preferences.startUpAction).toBe('blank')
    expect(preferences.tabBarVisibility).toBe(true)
  })
  it('replaces the last saved tab with a fresh editable blank document', () => {
    const store = useEditorStore()
    store.NEW_UNTITLED_TAB({})
    const old = store.currentFile!
    old.pathname = '/old.md'
    old.markdown = 'old contents'
    const emit = vi.spyOn(bus, 'emit')
    store.CLOSE_TAB()
    expect(store.tabs).toHaveLength(1)
    expect(store.currentFile?.id).not.toBe(old.id)
    expect(store.currentFile?.pathname).toBe('')
    expect(store.currentFile?.markdown).toBe('')
    expect(window.DIRNAME).toBe('')
    expect(emit).toHaveBeenCalledWith('file-loaded', expect.objectContaining({ markdown: '' }))
  })
  it('waits for the save/discard response before closing unsaved work', () => {
    const store = useEditorStore()
    store.NEW_UNTITLED_TAB({})
    const old = store.currentFile!
    old.markdown = 'unsaved work'
    old.isSaved = false
    const send = vi.spyOn(window.electron.ipcRenderer, 'send')
    store.CLOSE_TAB()
    expect(store.currentFile?.id).toBe(old.id)
    expect(store.currentFile?.markdown).toBe('unsaved work')
    expect(send).toHaveBeenCalledWith('mt::save-and-close-tabs', expect.any(Array))
    store.CLOSE_TABS([old.id])
    expect(store.tabs).toHaveLength(1)
    expect(store.currentFile?.id).not.toBe(old.id)
    expect(store.currentFile?.markdown).toBe('')
  })
  it('selects an existing neighbor without creating an extra document', () => {
    const store = useEditorStore()
    store.NEW_UNTITLED_TAB({})
    const first = store.currentFile!
    store.NEW_UNTITLED_TAB({})
    store.CLOSE_TAB()
    expect(store.tabs).toHaveLength(1)
    expect(store.currentFile?.id).toBe(first.id)
  })
  it('flushes pending edits before deciding whether the active file needs saving', () => {
    const store = useEditorStore()
    store.NEW_UNTITLED_TAB({})
    const old = store.currentFile!
    const flush = () => {
      old.isSaved = false
      old.markdown = 'last keystroke'
    }
    bus.on('flush-active-editor', flush)
    try {
      store.CLOSE_TAB()
      expect(store.currentFile?.id).toBe(old.id)
      expect(store.currentFile?.markdown).toBe('last keystroke')
    } finally {
      bus.off('flush-active-editor', flush)
    }
  })
  it('Close All and Close Saved each leave one fresh blank file', () => {
    const store = useEditorStore()
    for (let i = 0; i < 3; i++) store.NEW_UNTITLED_TAB({})
    const oldIds = store.tabs.map((tab) => tab.id)
    store.CLOSE_ALL_TABS()
    expect(store.tabs).toHaveLength(1)
    expect(oldIds).not.toContain(store.currentFile?.id)
    const old = store.currentFile!.id
    store.CLOSE_SAVED_TABS()
    expect(store.tabs).toHaveLength(1)
    expect(store.currentFile?.id).not.toBe(old)
  })
})
