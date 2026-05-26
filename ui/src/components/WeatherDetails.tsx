import {
  Compass,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
} from "lucide-react";
import type { CurrentWeather } from "../types";

export function WeatherDetails({
  current,
  sunrise,
  sunset,
  timezoneOffset,
}: {
  current: CurrentWeather;
  sunrise: number;
  sunset: number;
  timezoneOffset: number;
}) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-3 pb-4">
      <DetailCard
        icon={Thermometer}
        label="Feels Like"
        value={`${Math.round(current.feelsLike)}°`}
        sub={feelsLikeDescription(current.temp, current.feelsLike)}
      />
      <DetailCard
        icon={Droplets}
        label="Humidity"
        value={`${current.humidity}%`}
        sub={humidityDesc(current.humidity)}
      />
      <DetailCard
        icon={Wind}
        label="Wind"
        value={`${current.windSpeed.toFixed(1)} m/s`}
        sub={windDirection(current.windDeg)}
      />
      <DetailCard
        icon={Eye}
        label="Visibility"
        value={formatVisibility(current.visibility)}
        sub={visibilityDesc(current.visibility)}
      />
      <DetailCard
        icon={Gauge}
        label="Pressure"
        value={`${current.pressure} hPa`}
        sub={pressureDesc(current.pressure)}
      />
      <DetailCard
        icon={Compass}
        label="Wind Dir"
        value={`${current.windDeg}°`}
        sub={windDirection(current.windDeg)}
      />
      <DetailCard
        icon={Sunrise}
        label="Sunrise"
        value={formatTime(sunrise, timezoneOffset)}
      />
      <DetailCard
        icon={Sunset}
        label="Sunset"
        value={formatTime(sunset, timezoneOffset)}
      />
    </div>
  );
}

function DetailCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl bg-black/30 p-3 backdrop-blur-md">
      <div className="flex items-center gap-1.5 text-white/50">
        <Icon className="size-3" />
        <span className="text-[10px] font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="mt-1 text-xl font-light text-white">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-white/50">{sub}</p>}
    </div>
  );
}

// ── Formatters ───────────────────────────────────────────────────────────────

function formatTime(ts: number, offset: number): string {
  const d = new Date((ts + offset) * 1000);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

function formatVisibility(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)} km`;
  return `${v} m`;
}

function windDirection(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

function feelsLikeDescription(actual: number, feels: number): string {
  const diff = feels - actual;
  if (Math.abs(diff) < 2) return "Similar to actual";
  return diff > 0 ? "Feels warmer" : "Feels cooler";
}

function humidityDesc(h: number): string {
  if (h < 30) return "Low";
  if (h < 60) return "Comfortable";
  if (h < 80) return "Moderate";
  return "High";
}

function visibilityDesc(v: number): string {
  if (v >= 10000) return "Excellent";
  if (v >= 5000) return "Good";
  if (v >= 1000) return "Moderate";
  return "Poor";
}

function pressureDesc(p: number): string {
  if (p < 1000) return "Low";
  if (p < 1015) return "Normal";
  return "High";
}
