"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"
import { usePreferences } from "@/contexts/PreferencesContext"

interface EnhancedThemeProviderProps extends Omit<ThemeProviderProps, 'forcedTheme' | 'theme'> {
  children: React.ReactNode
}

export function ThemeProvider({ children, ...props }: EnhancedThemeProviderProps) {
  const { preferences } = usePreferences()
  
  // PreferencesContext의 테마 설정을 next-themes에 전달
  return (
    <NextThemesProvider 
      {...props}
      enableSystem={true} 
      defaultTheme={preferences.theme}
    >
      {children}
    </NextThemesProvider>
  )
}
