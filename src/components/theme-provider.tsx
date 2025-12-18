import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)

  // Initialize theme from localStorage on client side
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored === 'dark' || stored === 'light' || stored === 'system') {
        setThemeState(stored)
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [storageKey])

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    console.log('setTheme called with:', newTheme)
    try {
      localStorage.setItem(storageKey, newTheme)
      console.log('Theme saved to localStorage:', storageKey, newTheme)
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error)
    }
    setThemeState(newTheme)
    console.log('Theme state updated to:', newTheme)
  }

  const value = {
    theme,
    setTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context.setTheme === initialState.setTheme) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
