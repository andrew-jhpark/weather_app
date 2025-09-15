"use client";

import { useI18n } from "@/contexts/I18nContext";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageToggleProps {
  variant?: "icon" | "button";
}

export function LanguageToggle({ variant = "button" }: LanguageToggleProps) {
  const { language, setLanguage } = useI18n();

  const isActive = (lang: string) => language === lang;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "icon" ? (
          <Button variant="outline" size="icon">
            <Languages className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">언어 변경</span>
          </Button>
        ) : (
          <Button variant="outline" className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            {language === "ko" ? "한국어" : "English"}
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={variant === "icon" ? "end" : "start"}>
        <DropdownMenuItem
          onClick={() => setLanguage("ko")}
          disabled={language === "ko"}
          className={language === "ko" ? "bg-accent" : ""}
        >
          한국어
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          disabled={language === "en"}
          className={language === "en" ? "bg-accent" : ""}
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}




