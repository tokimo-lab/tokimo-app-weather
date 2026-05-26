import type { DailyForecast } from "../types";
import { WeatherIcon } from "./WeatherIcon";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeatherDaily({ daily }: { daily: DailyForecast[] }) {
  if (daily.length === 0) return null;

  // Find global temp range for the bar chart
  const allMin = Math.min(...daily.map((d) => d.tempMin));
  const allMax = Math.max(...daily.map((d) => d.tempMax));
  const range = allMax - allMin || 1;

  return (
    <div className="mt-3 rounded-2xl bg-black/30 p-4 backdrop-blur-md">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
        {daily.length}-Day Forecast
      </p>
      <div className="space-y-2">
        {daily.map((d, i) => {
          const leftPct = ((d.tempMin - allMin) / range) * 100;
          const widthPct = ((d.tempMax - d.tempMin) / range) * 100;

          return (
            <div key={d.dt} className="flex items-center gap-2">
              <span className="w-10 shrink-0 text-sm text-white/80">
                {i === 0 ? "Today" : getWeekday(d.dt)}
              </span>
              <WeatherIcon
                code={d.weatherCode}
                isDay={true}
                className="size-5 shrink-0"
              />
              <span
                className={`w-8 shrink-0 text-right text-[10px] ${d.pop > 0.05 ? "text-sky-300" : "text-white/30"}`}
              >
                {Math.round(d.pop * 100)}%
              </span>
              <span className="w-8 shrink-0 text-right text-sm text-white/50">
                {Math.round(d.tempMin)}°
              </span>
              {/* Temperature bar */}
              <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/15">
                <div
                  className="absolute h-full rounded-full"
                  style={{
                    left: `${leftPct}%`,
                    width: `${Math.max(widthPct, 4)}%`,
                    background: tempBarGradient(d.tempMin, d.tempMax),
                  }}
                />
              </div>
              <span className="w-8 shrink-0 text-sm text-white">
                {Math.round(d.tempMax)}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getWeekday(dt: number): string {
  return WEEKDAYS[new Date(dt * 1000).getDay()];
}

function tempBarGradient(min: number, max: number): string {
  const cold = tempColor(min);
  const warm = tempColor(max);
  return `linear-gradient(90deg, ${cold}, ${warm})`;
}

function tempColor(temp: number): string {
  // Map temperature to color: cold blue → warm orange → hot red
  if (temp <= -10) return "#6ea8fe";
  if (temp <= 0) return "#8ec5fc";
  if (temp <= 10) return "#a5d6a7";
  if (temp <= 20) return "#fff176";
  if (temp <= 30) return "#ffab40";
  return "#ef5350";
}
