"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { UserPreferences } from "@/types/weather.types";

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
}

const defaultPreferences: UserPreferences = {
  units: "metric", // metric 또는 imperial
  language: "ko", // ko 또는 en
  windSpeedUnit: "m/s", // m/s, km/h, mph
  pressureUnit: "hPa",
  theme: "system", // light, dark, system
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined
);

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
};

interface PreferencesProviderProps {
  children: React.ReactNode;
}

export const PreferencesProvider = ({
  children,
}: PreferencesProviderProps) => {
  const [preferences, setPreferences] = useState<UserPreferences>(
    defaultPreferences
  );

  // localStorage에서 설정 로드
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedPrefs = localStorage.getItem("wa:prefs");
        if (storedPrefs) {
          const parsedPrefs = JSON.parse(storedPrefs);
          setPreferences((prev) => ({
            ...prev,
            ...parsedPrefs,
          }));
        }
      } catch (error) {
        console.error("Error loading preferences from localStorage:", error);
      }
    }
  }, []);

  // 설정 업데이트 함수
  const updatePreferences = useCallback((newPrefs: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const updatedPrefs = { ...prev, ...newPrefs };
      
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("wa:prefs", JSON.stringify(updatedPrefs));
        } catch (error) {
          console.error("Error saving preferences to localStorage:", error);
        }
      }
      
      return updatedPrefs;
    });
  }, []);

  const value = { preferences, updatePreferences };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};
