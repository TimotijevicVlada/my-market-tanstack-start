export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeState {
  themeMode: ThemeMode
}

export interface ThemeActions {
  setThemeMode: (mode: ThemeMode) => void
  toggleTheme: () => void
}
