import { useEffect, useRef } from "react";
import {
  getMoonPhase,
  getWeatherKind,
  WeatherGL,
  type WeatherKind,
} from "./webgl-weather";

export { getWeatherKind, type WeatherKind };

/**
 * GPU-accelerated weather background via WebGL fragment shader.
 *
 * All effects (rain, snow, clouds, lightning, stars, fog, sun/moon)
 * are procedurally rendered on the GPU in a single pass.
 */
export function WeatherBackground({
  weatherCode,
  isNight,
}: {
  weatherCode: number;
  isNight: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WeatherGL | null>(null);
  const kind = getWeatherKind(weatherCode);
  const moonPhase = getMoonPhase();

  // Init WebGL once — weather params updated via separate effect below
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const wgl = new WeatherGL(canvas);
      glRef.current = wgl;
      wgl.start(kind, isNight, moonPhase);
    } catch {
      // WebGL not available — leave black
    }
    return () => {
      glRef.current?.destroy();
      glRef.current = null;
    };
  }, [isNight, kind, moonPhase]);

  // Update weather params without re-creating context
  useEffect(() => {
    glRef.current?.setWeather(kind, isNight, moonPhase);
  }, [kind, isNight, moonPhase]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 size-full"
    />
  );
}
