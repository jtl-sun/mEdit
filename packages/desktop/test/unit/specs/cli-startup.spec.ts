import { describe, it, expect, vi, afterEach } from 'vitest'
import path from 'path'

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
  it('ignores the entry path after Electron inspector flags', () => {
    mockApp.isPackaged = false
    process.argv = ['electron', '--inspect=0', '--remote-debugging-port=0', '/app', '--user-data-dir', '/profile']
    expect(cli()._.filter((value) => !value.startsWith('--'))).toEqual([])
    expect(cli()['--user-data-dir']).toBe(path.resolve('/profile'))
  })
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
