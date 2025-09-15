"use client";

import { LocationProvider } from "@/contexts/LocationContext";
import { PreferencesProvider } from "@/contexts/PreferencesContext";
import { I18nProvider } from "@/contexts/I18nContext";
import { ThemeProvider } from "@/components/theme/theme-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <PreferencesProvider>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <I18nProvider>
          <LocationProvider>{children}</LocationProvider>
        </I18nProvider>
      </ThemeProvider>
    </PreferencesProvider>
  );
}
