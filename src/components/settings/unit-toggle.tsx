"use client";

import { usePreferences } from "@/contexts/PreferencesContext";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function UnitToggle() {
  const { preferences, updatePreferences } = usePreferences();
  
  // 현재 단위를 기준으로 체크 여부 결정 (기본값은 metric = false)
  const isChecked = preferences?.units === "imperial";

  const toggleUnit = () => {
    // 현재 체크 상태의 반대로 단위 설정
    const newUnit = isChecked ? "metric" : "imperial";
    updatePreferences({ units: newUnit });
  };

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="unit-toggle" className="sr-only">
        온도 단위
      </Label>
      <div className="flex items-center gap-1">
        <span className={!isChecked ? "font-medium" : "text-muted-foreground"}>
          °C
        </span>
      </div>
      <Switch
        id="unit-toggle"
        checked={isChecked}
        onCheckedChange={toggleUnit}
      />
      <div className="flex items-center gap-1">
        <span className={isChecked ? "font-medium" : "text-muted-foreground"}>
          °F
        </span>
      </div>
    </div>
  );
}
