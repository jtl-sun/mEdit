import { describe, expect, it } from 'vitest'
import preferenceDefaults from '../../../static/preference.json'
import preferenceSchema from '../../../src/main/preferences/schema.json'

describe('classic drop-down menu default', () => {
  it('uses the native title bar for new installations', () => {
    expect(preferenceDefaults.titleBarStyle).toBe('native')
    expect(preferenceSchema.titleBarStyle.default).toBe('native')
  })
})
