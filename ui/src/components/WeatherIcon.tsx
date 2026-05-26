/** iOS-style weather icons via @bybas/weather-icons (served as static assets). */

function wmoToIconName(code: number, isDay: boolean): string {
  const d = isDay ? "day" : "night";
  if (code === 0) return `clear-${d}`;
  if (code <= 2) return `partly-cloudy-${d}`;
  if (code === 3) return `overcast-${d}`;
  if (code === 45 || code === 48) return `fog-${d}`;
  if (code >= 51 && code <= 55) return `partly-cloudy-${d}-drizzle`;
  if (code === 56 || code === 57) return "drizzle";
  if (code >= 61 && code <= 65) return `partly-cloudy-${d}-rain`;
  if (code === 66 || code === 67) return "sleet";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "rain";
  if (code >= 85 && code <= 86) return "snow";
  if (code === 95) return `thunderstorms-${d}`;
  if (code >= 96) return `thunderstorms-${d}-rain`;
  return `partly-cloudy-${d}`;
}

interface WeatherIconProps {
  code: number;
  isDay: boolean;
  className?: string;
}

export function WeatherIcon({
  code,
  isDay,
  className = "size-7",
}: WeatherIconProps) {
  const name = wmoToIconName(code, isDay);
  return (
    <img
      src={`/weather-icons/${name}.svg`}
      alt=""
      draggable={false}
      className={className}
    />
  );
}
