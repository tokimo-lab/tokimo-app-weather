import { useCallback, useEffect, useState } from "react";
import type { CityEntry, WeatherSettings } from "./types";

const STORAGE_KEY = "tokimo-weather-settings";

function parseSettings(raw: string | null): WeatherSettings {
  if (!raw) {
    return { cities: [], primaryIndex: 0 };
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return { cities: [], primaryIndex: 0 };
    }
    const obj = parsed as Record<string, unknown>;
    const cities = Array.isArray(obj.cities)
      ? obj.cities.filter((c: unknown): c is CityEntry => {
          if (typeof c !== "object" || c === null) return false;
          const entry = c as Record<string, unknown>;
          return (
            typeof entry.lat === "number" &&
            typeof entry.lon === "number" &&
            typeof entry.name === "string" &&
            typeof entry.country === "string"
          );
        })
      : [];
    const primaryIndex =
      typeof obj.primaryIndex === "number" ? obj.primaryIndex : 0;
    return {
      cities,
      primaryIndex: Math.max(0, Math.min(primaryIndex, cities.length - 1)),
    };
  } catch {
    return { cities: [], primaryIndex: 0 };
  }
}

export function useWeatherSettings() {
  const [settings, setSettingsState] = useState<WeatherSettings>(() =>
    parseSettings(localStorage.getItem(STORAGE_KEY)),
  );

  const save = useCallback((newSettings: WeatherSettings) => {
    setSettingsState(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setSettingsState(parseSettings(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return { settings, save };
}
