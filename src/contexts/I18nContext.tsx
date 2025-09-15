"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { usePreferences } from "./PreferencesContext";

// JSON 파일의 타입을 추론하기 위한 헬퍼 타입
type TranslationKeys = Record<string, any>;

interface I18nContextType {
  t: (key: string, ...args: any[]) => string;
  language: string;
  setLanguage: (lang: "ko" | "en") => void;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};

// 키 문자열을 사용하여 중첩된 객체에서 값을 찾는 함수
const getNestedValue = (obj: TranslationKeys, key: string): string => {
  return key.split(".").reduce((acc: any, part: string) => {
    if (acc && typeof acc === "object" && part in acc) {
      return acc[part];
    }
    return key; // 키를 찾지 못하면 키 자체를 반환
  }, obj as any) as string;
};

// 변수를 번역 문자열에 주입하는 함수
const interpolate = (str: string, ...args: any[]): string => {
  if (!args.length) return str;
  // 현재는 간단하게 첫 번째 인자의 객체 키-값으로 대체
  const params = args[0];
  if (typeof params !== "object" || params === null) return str;

  return str.replace(/{(\w+)}/g, (placeholder, key) => {
    return params.hasOwnProperty(key) ? params[key] : placeholder;
  });
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const { preferences, updatePreferences } = usePreferences();
  const [translations, setTranslations] = useState<TranslationKeys>({});
  const [isLoading, setIsLoading] = useState(true);

  // preferences가 로드되기 전에도 language가 기본값을 갖도록 수정
  const language = preferences?.language || "ko";

  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const langModule = await import(`@/locales/${language}.json`);
        setTranslations(langModule.default);
      } catch (error) {
        console.error("Failed to load translations:", error);
        // fallback to English on error
        const langModule = await import(`@/locales/en.json`);
        setTranslations(langModule.default);
      } finally {
        setIsLoading(false);
      }
    };
    loadTranslations();
  }, [language]);

  const setLanguage = useCallback(
    (lang: "ko" | "en") => {
      updatePreferences({ language: lang });
    },
    [updatePreferences]
  );

  const t = useCallback(
    (key: string, ...args: any[]): string => {
      if (isLoading || !translations) {
        return "";
      }
      const translatedString = getNestedValue(translations, key);
      return interpolate(translatedString, ...args);
    },
    [translations, isLoading]
  );

  const value = {
    t,
    language, // 수정된 language 변수 사용
    setLanguage,
    isLoading,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
