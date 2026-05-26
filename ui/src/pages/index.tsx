import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@tokimo/ui";
import { MapPin, Settings, X } from "lucide-react";
import { useEffect, useState } from "react";
import { WeatherAirQuality } from "../components/WeatherAirQuality";
import { WeatherBackground } from "../components/WeatherBackground";
import { WeatherCurrent } from "../components/WeatherCurrent";
import { WeatherDaily } from "../components/WeatherDaily";
import { WeatherDetails } from "../components/WeatherDetails";
import { WeatherHourly } from "../components/WeatherHourly";
import { WeatherSettingsPage } from "../components/WeatherSettingsPage";
import type { WeatherResponse } from "../types";
import { useWeatherSettings } from "../use-weather-settings";

export default function WeatherPage() {
  const { settings } = useWeatherSettings();
  const [viewIndex, setViewIndex] = useState(settings.primaryIndex);
  const [showSettings, setShowSettings] = useState(false);

  // Keep viewIndex in bounds when cities change
  useEffect(() => {
    if (settings.cities.length > 0 && viewIndex >= settings.cities.length) {
      setViewIndex(Math.max(0, settings.cities.length - 1));
    }
  }, [settings.cities.length, viewIndex]);

  // Sync viewIndex to primaryIndex when it changes externally
  useEffect(() => {
    setViewIndex(settings.primaryIndex);
  }, [settings.primaryIndex]);

  const currentCity = settings.cities[viewIndex] ?? null;
  const hasCities = settings.cities.length > 0;

  const { data, isLoading, error, refetch } = useQuery<WeatherResponse>({
    queryKey: ["weather", currentCity?.lat, currentCity?.lon],
    queryFn: async () => {
      if (!currentCity) throw new Error("No city selected");
      const res = await fetch(
        `/api/apps/weather/weather?lat=${currentCity.lat}&lon=${currentCity.lon}`,
      );
      if (!res.ok) throw new Error("Failed to fetch weather");
      return res.json();
    },
    enabled: !!currentCity,
    refetchInterval: 300_000,
    retry: 1,
  });

  const displayName = currentCity?.name || data?.location.name || "";
  const weatherCode = data?.current.weatherCode ?? 0;
  const isNight = data ? !data.current.isDay : false;

  if (showSettings) {
    return (
      <div className="relative flex h-full flex-col overflow-hidden bg-[#1c1c1e]">
        <div className="flex items-center gap-2 px-4 pt-12 pb-2">
          <button
            type="button"
            onClick={() => setShowSettings(false)}
            className="cursor-pointer rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X className="size-4" />
          </button>
          <h2 className="text-sm font-semibold text-white">Weather Settings</h2>
        </div>
        <ScrollArea direction="vertical" className="flex-1 px-4 pb-4">
          <WeatherSettingsPage />
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="relative flex h-full select-none flex-col overflow-hidden">
      <WeatherBackground weatherCode={weatherCode} isNight={isNight} />

      {/* Top bar — settings button top-left */}
      <div className="relative z-20 flex items-center px-4 pt-12 pb-1">
        <button
          type="button"
          onClick={() => setShowSettings(true)}
          className="cursor-pointer rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
          title="Weather Settings"
        >
          <Settings className="size-4" />
        </button>
      </div>

      {/* Content — extra bottom padding for dots */}
      <ScrollArea
        direction="vertical"
        hideScrollbar
        className="relative z-10 flex-1 px-4 pb-16"
      >
        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
            <div className="size-6 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          </div>
        ) : error ? (
          <div className="mt-20 text-center text-white/80">
            <p className="text-sm">
              {error instanceof Error
                ? error.message
                : "Failed to load weather"}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 cursor-pointer rounded-lg bg-white/20 px-4 py-1.5 text-sm text-white transition-colors hover:bg-white/30"
            >
              Retry
            </button>
          </div>
        ) : data ? (
          <>
            <WeatherCurrent
              current={data.current}
              location={{ ...data.location, name: displayName }}
            />
            <WeatherHourly
              hourly={data.hourly}
              timezoneOffset={data.location.timezoneOffset}
            />
            <WeatherDaily daily={data.daily} />
            <WeatherDetails
              current={data.current}
              sunrise={data.current.sunrise}
              sunset={data.current.sunset}
              timezoneOffset={data.location.timezoneOffset}
            />
            {data.airQuality && <WeatherAirQuality aq={data.airQuality} />}
          </>
        ) : (
          <div className="flex h-60 flex-col items-center justify-center gap-3 text-white/60">
            {!hasCities && (
              <>
                <MapPin className="size-8 text-white/30" />
                <p className="text-sm">Add a city to see weather</p>
                <button
                  type="button"
                  onClick={() => setShowSettings(true)}
                  className="cursor-pointer rounded-lg bg-white/20 px-4 py-2 text-sm text-white transition-colors hover:bg-white/30"
                >
                  Open Settings
                </button>
              </>
            )}
          </div>
        )}
      </ScrollArea>

      {/* iOS-style city dots — fixed at bottom */}
      {hasCities && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1">
          {settings.cities.map((city, i) => (
            <button
              key={`${city.lat}-${city.lon}`}
              type="button"
              onClick={() => setViewIndex(i)}
              className="cursor-pointer p-1.5"
              title={city.name}
            >
              <span
                className={`block rounded-full transition-all duration-200 ${
                  i === viewIndex
                    ? "size-2 bg-white"
                    : "size-1.5 bg-white/40 hover:bg-white/60"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
