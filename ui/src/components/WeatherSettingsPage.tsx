import {
  Loader2,
  MapPin,
  Navigation,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslator } from "../TranslatorContext";
import type { CityEntry } from "../types";
import { useWeatherSettings } from "../use-weather-settings";

interface GeoResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export function WeatherSettingsPage() {
  const { t } = useTranslator();
  const { settings, save } = useWeatherSettings();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [addingGeo, setAddingGeo] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `/api/apps/weather/geocode?q=${encodeURIComponent(trimmed)}&limit=8`,
        );
        if (!res.ok) throw new Error("Geocode failed");
        const data: GeoResult[] = await res.json();
        setResults(
          data.map((r) => ({
            name: r.name,
            lat: r.lat,
            lon: r.lon,
            country: r.country,
            state: r.state ?? undefined,
          })),
        );
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const addCity = useCallback(
    (city: CityEntry) => {
      const exists = settings.cities.some(
        (c) =>
          Math.abs(c.lat - city.lat) < 0.01 &&
          Math.abs(c.lon - city.lon) < 0.01,
      );
      if (!exists) {
        save({ ...settings, cities: [...settings.cities, city] });
      }
      setQuery("");
      setResults([]);
    },
    [settings, save],
  );

  const removeCity = useCallback(
    (idx: number) => {
      const next = {
        ...settings,
        cities: settings.cities.filter((_, i) => i !== idx),
      };
      if (next.primaryIndex >= next.cities.length) {
        next.primaryIndex = Math.max(0, next.cities.length - 1);
      }
      save(next);
    },
    [settings, save],
  );

  const setPrimary = useCallback(
    (idx: number) => {
      save({ ...settings, primaryIndex: idx });
    },
    [settings, save],
  );

  const addCurrentLocation = useCallback(() => {
    setAddingGeo(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const city: CityEntry = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          name: "",
          country: "",
        };
        try {
          const res = await fetch(
            `/api/apps/weather/geocode?q=${city.lat.toFixed(2)},${city.lon.toFixed(2)}&limit=1`,
          );
          if (res.ok) {
            const r: GeoResult[] = await res.json();
            if (r.length > 0) {
              city.name = r[0].name;
              city.country = r[0].country;
            }
          }
        } catch {
          // ignore
        }
        if (city.name) {
          addCity(city);
        }
        setAddingGeo(false);
      },
      () => setAddingGeo(false),
      { enableHighAccuracy: false, timeout: 10000 },
    );
  }, [addCity]);

  // Close results when clicking outside
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setResults([]);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="space-y-5">
      {/* Add City section */}
      <div>
        <h3 className="text-[13px] font-semibold text-fg-primary mb-2">
          {t("settings.weather.addCity")}
        </h3>
        <div className="rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.03]">
          <div className="px-4 py-3.5" ref={containerRef}>
            <div className="relative">
              <div className="flex items-center gap-2 rounded-lg border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-white/[0.05] px-2.5 py-1.5 focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)]/30 transition-colors">
                <Search className="size-4 shrink-0 text-fg-muted" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("settings.weather.searchPlaceholder")}
                  className="flex-1 bg-transparent text-sm text-fg-primary outline-none placeholder:text-fg-muted"
                />
                {searching && (
                  <Loader2 className="size-4 shrink-0 animate-spin text-fg-muted" />
                )}
              </div>

              {/* Search results dropdown */}
              {query.trim() && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1c1c1e] shadow-lg">
                  <div className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
                    {results.map((r) => {
                      const alreadyAdded = settings.cities.some(
                        (c) =>
                          Math.abs(c.lat - r.lat) < 0.01 &&
                          Math.abs(c.lon - r.lon) < 0.01,
                      );
                      return (
                        <button
                          key={`${r.lat}-${r.lon}`}
                          type="button"
                          onClick={() => {
                            if (!alreadyAdded) {
                              addCity({
                                lat: r.lat,
                                lon: r.lon,
                                name: r.name,
                                country: r.country,
                              });
                            }
                          }}
                          disabled={alreadyAdded}
                          className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.05] first:rounded-t-xl last:rounded-b-xl disabled:cursor-default disabled:opacity-50"
                        >
                          <MapPin className="size-4 shrink-0 text-fg-muted" />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-fg-primary">
                              {r.name}
                              {r.state ? `, ${r.state}` : ""}
                            </span>
                            <span className="ml-2 text-xs text-fg-muted">
                              {r.country}
                            </span>
                          </div>
                          {alreadyAdded ? (
                            <span className="text-xs text-fg-muted">
                              {t("settings.weather.added")}
                            </span>
                          ) : (
                            <span className="size-4 text-fg-muted">+</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No results message */}
              {query.trim() &&
                !searching &&
                results.length === 0 &&
                query.trim().length >= 2 && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#1c1c1e] shadow-lg px-4 py-3 text-sm text-fg-muted">
                    {t("settings.weather.noResults")}
                  </div>
                )}
            </div>
          </div>

          {/* Use current location row */}
          <div className="border-t border-black/[0.04] dark:border-white/[0.06] px-4 py-3">
            <button
              type="button"
              onClick={addCurrentLocation}
              disabled={addingGeo}
              className="flex cursor-pointer items-center gap-2 text-sm text-[var(--accent)] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {addingGeo ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Navigation className="size-4" />
              )}
              {t("settings.weather.useCurrentLocation")}
            </button>
          </div>
        </div>
      </div>

      {/* Your Cities section */}
      <div>
        <h3 className="text-[13px] font-semibold text-fg-primary mb-2">
          {t("settings.weather.yourCities")}
        </h3>
        <div className="rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.03]">
          {settings.cities.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-fg-muted">
              {t("settings.weather.noCities")}
            </div>
          ) : (
            <div className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
              {settings.cities.map((city, i) => (
                <div
                  key={`${city.lat}-${city.lon}`}
                  className="flex items-center gap-3 px-4 py-3.5"
                >
                  <MapPin className="size-4 shrink-0 text-fg-muted" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm font-medium text-fg-primary leading-tight">
                      {city.name ||
                        `${city.lat.toFixed(2)}, ${city.lon.toFixed(2)}`}
                    </div>
                    <div className="text-xs text-fg-muted mt-0.5">
                      {city.country}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {i === settings.primaryIndex ? (
                      <span className="flex items-center gap-1 rounded-full bg-[var(--accent)]/10 px-2 py-0.5 text-xs font-medium text-[var(--accent)]">
                        <Star className="size-3 fill-current" />
                        {t("settings.weather.default")}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPrimary(i)}
                        title={t("settings.weather.setAsDefault")}
                        className="cursor-pointer rounded-full p-1.5 text-fg-muted transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-fg-primary"
                      >
                        <Star className="size-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeCity(i)}
                      title={t("settings.weather.removeCity")}
                      className="cursor-pointer rounded-full p-1.5 text-fg-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-fg-muted leading-relaxed">
        {t("settings.weather.description")}
      </p>
    </div>
  );
}
