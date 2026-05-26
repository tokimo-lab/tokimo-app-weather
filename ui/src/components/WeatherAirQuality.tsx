import { Wind } from "lucide-react";
import type { AirQuality } from "../types";

export function WeatherAirQuality({ aq }: { aq: AirQuality }) {
  const aqi = aq.europeanAqi ?? aq.usAqi;
  const aqiLabel = aq.europeanAqi != null ? "EU AQI" : "US AQI";
  const { level, color } = aqiLevel(aqi);

  return (
    <div className="mt-3 rounded-2xl bg-black/30 p-3 backdrop-blur-md">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-white/50">
          <Wind className="size-3" />
          <span className="text-[10px] font-medium uppercase tracking-wider">
            Air Quality
          </span>
        </div>
        {aqi != null && (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${color}`}
          >
            {level}
          </span>
        )}
      </div>

      {/* AQI value */}
      {aqi != null && (
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-3xl font-light text-white">
            {Math.round(aqi)}
          </span>
          <span className="text-xs text-white/50">{aqiLabel}</span>
        </div>
      )}

      {/* Pollutant grid */}
      <div className="mt-2 grid grid-cols-3 gap-x-2 gap-y-1.5">
        <Pollutant label="PM2.5" value={aq.pm25} unit="µg/m³" />
        <Pollutant label="PM10" value={aq.pm10} unit="µg/m³" />
        <Pollutant label="O₃" value={aq.ozone} unit="µg/m³" />
        <Pollutant label="NO₂" value={aq.nitrogenDioxide} unit="µg/m³" />
        <Pollutant label="SO₂" value={aq.sulphurDioxide} unit="µg/m³" />
        <Pollutant label="CO" value={aq.carbonMonoxide} unit="µg/m³" />
        {aq.dust != null && (
          <Pollutant label="Dust" value={aq.dust} unit="µg/m³" />
        )}
        {aq.uvIndex != null && (
          <Pollutant label="UV" value={aq.uvIndex} unit="" />
        )}
      </div>
    </div>
  );
}

function Pollutant({
  label,
  value,
  unit,
}: {
  label: string;
  value: number | null;
  unit: string;
}) {
  if (value == null) return null;
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-white/40">{label}</span>
      <span className="text-xs font-medium text-white/80">
        {value < 10 ? value.toFixed(1) : Math.round(value)}
        {unit && (
          <span className="ml-0.5 text-[9px] text-white/30">{unit}</span>
        )}
      </span>
    </div>
  );
}

// European AQI thresholds: 0-20 Good, 20-40 Fair, 40-60 Moderate,
// 60-80 Poor, 80-100 Very Poor, >100 Extremely Poor
function aqiLevel(aqi: number | null): { level: string; color: string } {
  if (aqi == null) return { level: "—", color: "bg-white/20 text-white/60" };
  if (aqi <= 20)
    return { level: "Good", color: "bg-green-500/30 text-green-300" };
  if (aqi <= 40)
    return { level: "Fair", color: "bg-lime-500/30 text-lime-300" };
  if (aqi <= 60)
    return { level: "Moderate", color: "bg-yellow-500/30 text-yellow-300" };
  if (aqi <= 80)
    return { level: "Poor", color: "bg-orange-500/30 text-orange-300" };
  if (aqi <= 100)
    return { level: "Very Poor", color: "bg-red-500/30 text-red-300" };
  return { level: "Hazardous", color: "bg-purple-500/30 text-purple-300" };
}
