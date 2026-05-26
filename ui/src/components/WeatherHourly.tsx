import { ScrollArea, type ScrollAreaRef } from "@tokimo/ui";
import { useEffect, useRef } from "react";
import type { HourlyForecast } from "../types";
import { WeatherIcon } from "./WeatherIcon";

export function WeatherHourly({
  hourly,
  timezoneOffset,
}: {
  hourly: HourlyForecast[];
  timezoneOffset: number;
}) {
  const visible = hourly.slice(0, 24);
  const scrollRef = useRef<ScrollAreaRef>(null);
  const nowRef = useRef<HTMLDivElement>(null);

  // Find the index of the current hour
  const nowEpoch = Math.floor(Date.now() / 1000) + timezoneOffset;
  const currentIdx = visible.findIndex((h, i) => {
    const next = visible[i + 1];
    return next ? nowEpoch >= h.dt && nowEpoch < next.dt : nowEpoch >= h.dt;
  });

  // Auto-scroll to center current hour
  useEffect(() => {
    if (!scrollRef.current || !nowRef.current) return;
    const item = nowRef.current;
    const viewport = item.offsetParent as HTMLElement | null;
    if (!viewport) return;
    const offset =
      item.offsetLeft - viewport.clientWidth / 2 + item.offsetWidth / 2;
    scrollRef.current.scrollTo(Math.max(0, offset), 0);
  }, []);

  return (
    <div className="mt-2 rounded-2xl bg-black/30 p-4 backdrop-blur-md">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
        Forecast
      </p>
      <ScrollArea ref={scrollRef} direction="horizontal" hideScrollbar>
        <div className="-mx-1 flex gap-4 px-1">
          {visible.map((h, i) => {
            const isCurrent = i === currentIdx;
            return (
              <div
                key={h.dt}
                ref={isCurrent ? nowRef : undefined}
                className={`flex shrink-0 flex-col items-center gap-1 rounded-xl px-2 py-1.5 ${
                  isCurrent ? "bg-white/20 ring-1 ring-white/30" : ""
                }`}
              >
                <span
                  className={`text-xs ${isCurrent ? "font-bold text-white" : "text-white/70"}`}
                >
                  {isCurrent ? "Now" : formatHour(h.dt, timezoneOffset)}
                </span>
                <WeatherIcon
                  code={h.weatherCode}
                  isDay={h.isDay}
                  className="size-8"
                />
                <span
                  className={`text-[10px] ${h.pop > 0.05 ? "text-sky-300" : "text-white/30"}`}
                >
                  {Math.round(h.pop * 100)}%
                </span>
                <span className="text-sm font-medium text-white">
                  {Math.round(h.temp)}°
                </span>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

function formatHour(dt: number, _offset: number): string {
  const date = new Date(dt * 1000);
  const h = date.getUTCHours();
  return h === 0
    ? "12AM"
    : h < 12
      ? `${h}AM`
      : h === 12
        ? "12PM"
        : `${h - 12}PM`;
}
