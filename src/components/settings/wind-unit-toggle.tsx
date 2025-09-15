"use client";

import { usePreferences } from "@/contexts/PreferencesContext";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/contexts/I18nContext";

export function WindUnitToggle() {
  const { preferences, updatePreferences } = usePreferences();
  const { t } = useI18n();
  
  const handleWindUnitChange = (value: string) => {
    // TypeScript 타입 가드
    if (value === "m/s" || value === "km/h" || value === "mph") {
      updatePreferences({ windSpeedUnit: value });
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Label htmlFor="wind-unit-select" className="min-w-24 text-sm">
        {t("settings.windSpeed")}:
      </Label>
      <Select
        value={preferences.windSpeedUnit}
        onValueChange={handleWindUnitChange}
      >
        <SelectTrigger id="wind-unit-select" className="w-24">
          <SelectValue placeholder={preferences.windSpeedUnit} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="m/s">m/s</SelectItem>
          <SelectItem value="km/h">km/h</SelectItem>
          <SelectItem value="mph">mph</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
