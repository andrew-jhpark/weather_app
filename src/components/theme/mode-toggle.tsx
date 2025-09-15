"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect } from "react"
import { usePreferences } from "@/contexts/PreferencesContext"
import { useI18n } from "@/contexts/I18nContext"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()
  const { preferences, updatePreferences } = usePreferences()
  const { t } = useI18n()
  
  // 테마 변경시 선택한 테마 표시를 위한 함수
  const isActive = (mode: string) => theme === mode
  
  // PreferencesContext와 next-themes 상태 동기화
  useEffect(() => {
    if (theme && theme !== preferences.theme) {
      updatePreferences({ theme: theme as "light" | "dark" | "system" })
    }
  }, [theme, preferences.theme, updatePreferences])
  
  // 테마 변경 함수
  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    updatePreferences({ theme: newTheme })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="focus-visible:ring-0">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">테마 전환</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleThemeChange("light")}
          className={isActive("light") ? "bg-accent" : ""}
        >
          {t("settings.lightMode")}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange("dark")}
          className={isActive("dark") ? "bg-accent" : ""}
        >
          {t("settings.darkMode")}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange("system")}
          className={isActive("system") ? "bg-accent" : ""}
        >
          {t("settings.systemMode")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
