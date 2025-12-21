import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemeActions, ThemeMode, ThemeState } from './types'

export const INITIAL_THEME_STATE: ThemeState = {
  themeMode: 'light',
}

const setThemeToHTML = (mode: ThemeMode) => {
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')
  if (mode === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light'

    root.classList.add(systemTheme)
    return
  }
  root.classList.add(mode)
}

export const useThemeStore = create<ThemeState & ThemeActions>()(
  persist(
    (set) => ({
      ...INITIAL_THEME_STATE,
      setThemeMode: (mode) => {
        set({ themeMode: mode })
        setThemeToHTML(mode)
      },
    }),
    { name: 'theme' },
  ),
)
