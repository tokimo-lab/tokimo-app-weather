import type { CurrentWeather, WeatherLocation } from "../types";

export function WeatherCurrent({
  current,
  location,
}: {
  current: CurrentWeather;
  location: WeatherLocation;
}) {
  return (
    <div className="flex flex-col items-center pt-2 pb-4 text-white">
      <p className="text-sm font-medium tracking-wide text-white/90">
        {location.name}
      </p>
      <p className="mt-1 text-7xl font-extralight tabular-nums leading-none tracking-tighter">
        {Math.round(current.temp)}°
      </p>
      <p className="mt-1 text-sm capitalize text-white/80">
        {current.weatherDescription}
      </p>
      <p className="mt-0.5 text-sm text-white/60">
        H:{Math.round(current.tempMax)}° L:{Math.round(current.tempMin)}°
      </p>
    </div>
  );
}
