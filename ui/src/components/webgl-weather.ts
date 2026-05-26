/**
 * WebGL weather background renderer.
 *
 * All effects drawn on GPU via fragment shaders:
 * - Sky gradient (procedural, day/night aware)
 * - Rain (streaks with motion blur + splash)
 * - Snow (soft bokeh flakes with wind sway)
 * - Stars (twinkling, only at night clear)
 * - Lightning (bright screen flash + fork bolt)
 * - Fog (perlin noise overlay, drifting)
 * - Clouds (layered noise scrolling)
 * - Sun glow / moon glow (radial, animated)
 */

export type WeatherKind =
  | "clear"
  | "clouds"
  | "rain"
  | "drizzle"
  | "snow"
  | "thunderstorm"
  | "atmosphere";

export function getWeatherKind(code: number): WeatherKind {
  if (code >= 95) return "thunderstorm";
  if (code >= 85) return "snow";
  if (code >= 80) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 61 && code <= 67) return "rain";
  if (code >= 51 && code <= 57) return "drizzle";
  if (code === 45 || code === 48) return "atmosphere";
  if (code >= 1 && code <= 3) return "clouds";
  return "clear";
}

/**
 * Approximate lunar phase as 0..1 using a synodic month calculation.
 * 0 = new moon, 0.5 = full moon, 1 = next new moon.
 * Reference new moon: 2000-01-06 18:14 UTC (known astronomical datum).
 */
export function getMoonPhase(date: Date = new Date()): number {
  const SYNODIC_MONTH = 29.53058770576;
  const REF_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0);
  const daysSinceRef = (date.getTime() - REF_NEW_MOON) / 86_400_000;
  return (((daysSinceRef / SYNODIC_MONTH) % 1) + 1) % 1;
}

// ── Shader sources ───────────────────────────────────────────────────────────

const VERT = `#version 100
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Single fragment shader covering all weather effects
const FRAG = `#version 100
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform float u_kind;   // 0=clear 1=clouds 2=rain 3=drizzle 4=snow 5=thunder 6=fog
uniform float u_night;  // 0.0=day, 1.0=night
uniform float u_moon;   // moon phase 0..1 (0=new, 0.5=full, 1=new)
uniform float u_tod;    // time of day 0..1 (0=midnight, 0.5=noon)

// ── Hash / noise ─────────────────────────────────────────────────────────────

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float hash1(float n) {
  return fract(sin(n) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.0;
    a *= 0.5;
  }
  return v;
}

// ── Time-of-day helpers ───────────────────────────────────────────────────────
// Returns 0 at dawn/dusk edges, 1 at solar noon (sun is up ~0.21=5am to ~0.79=7pm)
float sunPhase() {
  float frac = clamp((u_tod - 0.21) / 0.58, 0.0, 1.0);
  return 1.0 - abs(frac * 2.0 - 1.0);
}

// Sun disc color: deep orange at dawn/dusk → warm white-yellow at noon
vec3 sunTodColor() {
  float e = sunPhase(); e = e * e;
  return mix(vec3(1.00, 0.35, 0.04), vec3(1.00, 0.93, 0.52), e);
}

// Outer glow color: warmer / more diffuse than disc
vec3 glowTodColor() {
  float e = sunPhase(); e = e * e;
  return mix(vec3(1.00, 0.50, 0.12), vec3(1.00, 0.96, 0.72), e);
}

// ── Sky gradient ─────────────────────────────────────────────────────────────

vec3 skyDay(float y, float kind) {
  if (kind < 0.5) {           // clear - rich atmospheric 3-stop gradient
    vec3 zenith  = vec3(0.06, 0.22, 0.72);
    vec3 midsky  = vec3(0.22, 0.48, 0.86);
    vec3 horiz   = vec3(0.48, 0.72, 0.98);
    float t1 = smoothstep(0.0, 0.42, y);
    float t2 = smoothstep(0.38, 1.0, y);
    vec3 base = mix(mix(horiz, midsky, t1), zenith, t2);
    // Dawn/dusk: warm the lower sky with sun color
    float golden = 1.0 - sunPhase() * sunPhase();
    base = mix(base, base * mix(vec3(1.0), sunTodColor() * 1.3, 0.55), golden * exp(-y * 2.5));
    return base;
  }
  // Base sky colours per weather type
  vec3 top, bot;
  if (kind < 1.5) {    // clouds
    top = vec3(0.35, 0.50, 0.63);
    bot = vec3(0.69, 0.77, 0.85);
  } else if (kind < 2.5) {    // rain
    top = vec3(0.23, 0.31, 0.41);
    bot = vec3(0.44, 0.53, 0.60);
  } else if (kind < 3.5) {    // drizzle
    top = vec3(0.29, 0.42, 0.53);
    bot = vec3(0.54, 0.66, 0.74);
  } else if (kind < 4.5) {    // snow
    top = vec3(0.56, 0.67, 0.74);
    bot = vec3(0.84, 0.89, 0.93);
  } else if (kind < 5.5) {    // thunderstorm
    top = vec3(0.10, 0.12, 0.18);
    bot = vec3(0.22, 0.27, 0.33);
  } else {                    // atmosphere / fog
    top = vec3(0.48, 0.54, 0.60);
    bot = vec3(0.69, 0.74, 0.78);
  }
  return mix(bot, top, y);
}

vec3 skyNight(float y, float kind) {
  if (kind < 0.5) {           // clear night - deep starry sky
    vec3 zenith  = vec3(0.02, 0.04, 0.10);
    vec3 midsky  = vec3(0.04, 0.08, 0.16);
    vec3 horiz   = vec3(0.07, 0.13, 0.24);
    float t1 = smoothstep(0.0, 0.5, y);
    float t2 = smoothstep(0.45, 1.0, y);
    return mix(mix(horiz, midsky, t1), zenith, t2);
  }
  vec3 top, bot;
  if (kind < 1.5) {    // clouds
    top = vec3(0.08, 0.12, 0.18);
    bot = vec3(0.16, 0.21, 0.28);
  } else if (kind < 5.5) {    // rain / drizzle / snow / thunder
    top = vec3(0.04, 0.06, 0.10);
    bot = vec3(0.10, 0.14, 0.20);
  } else {                    // fog
    top = vec3(0.10, 0.12, 0.15);
    bot = vec3(0.18, 0.19, 0.22);
  }
  return mix(bot, top, y);
}

// ── Sun / Moon glow ──────────────────────────────────────────────────────────

vec3 celestialGlow(vec2 uv, float night, float time) {
  float aspect = u_res.x / u_res.y;
  if (night < 0.5) {
    // Soft sun: layered glow + bright disc
    vec2 sunPos = vec2(0.72, 0.82);
    vec2 d = (uv - sunPos) * vec2(aspect, 1.0);
    float dist = length(d);
    float outerGlow = exp(-dist * 6.5) * 0.14;
    float midGlow   = exp(-dist * 10.0) * 0.26;
    float innerGlow = exp(-dist * 14.0) * 0.50;
    float disc      = smoothstep(0.055, 0.025, dist);

    vec3 sunCol  = sunTodColor();
    vec3 glowCol = glowTodColor();
    return sunCol * (disc * 0.85 + innerGlow + midGlow * 0.38)
         + glowCol * outerGlow;
  } else {
    // iOS-style moon: small disc + subtle atmospheric glow
    vec2 moonPos = vec2(0.3, 0.85);
    vec2 d = (uv - moonPos) * vec2(aspect, 1.0);
    float dist = length(d);

    // Subtle atmospheric glow — colors close to night sky, just a hint brighter
    float glow1 = exp(-dist * 2.0) * 0.04;
    float glow2 = exp(-dist * 5.0) * 0.07;
    float glow3 = exp(-dist * 14.0) * 0.12;
    vec3 glow = vec3(0.08, 0.12, 0.22) * glow1
              + vec3(0.12, 0.17, 0.30) * glow2
              + vec3(0.20, 0.25, 0.38) * glow3;

    // Small moon disc with soft edge
    float r = 0.022;
    float moonDisc = smoothstep(r, r - 0.004, dist);

    // Phase crescent
    float phase = u_moon;
    float illum = 0.5 - 0.5 * cos(phase * 6.28318);
    float shadowDir = phase < 0.5 ? 1.0 : -1.0;
    float offset = shadowDir * (1.0 - illum) * r * 2.0;
    vec2 shadowCenter = d + vec2(offset, 0.0);
    float shadowDisc = smoothstep(r * 0.92, r * 0.92 - 0.004, length(shadowCenter));
    float crescent = moonDisc * max(1.0 - shadowDisc, illum);

    vec3 moonCol = vec3(0.65, 0.68, 0.75);
    return moonCol * crescent * 0.55 + glow;
  }
}

// ── Rain ─────────────────────────────────────────────────────────────────────

float rain(vec2 uv, float time, float intensity) {
  float v = 0.0;

  // Dynamic wind: slow base drift + occasional gusts
  float windBase = sin(time * 0.19) * 0.10 + sin(time * 0.67 + 2.0) * 0.05;
  float gust = 0.72 + 0.28 * sin(time * 0.37) * sin(time * 0.13 + 1.7);
  float eff = intensity * gust;

  // 5 depth layers: 0 = nearest (big, fast), 4 = farthest (small, slow)
  for (int layer = 0; layer < 5; layer++) {
    float fl = float(layer);
    float depth = fl * 0.25;

    // Cull distant layers for light rain
    if (depth > 0.55 && intensity < 0.4) continue;
    if (depth > 0.8 && intensity < 0.7) continue;

    // Near: fewer wider columns, far: many narrow columns
    float cols = mix(6.0, 26.0, depth) * mix(0.75, 1.0, eff);
    float rowAspect = mix(6.5, 3.2, depth);
    float rows = cols * rowAspect;

    // Near drops fall faster
    float speed = mix(2.0, 0.65, depth) * gust * rows;

    // Wind slant (near drops deflect more)
    float wind = windBase * mix(1.3, 0.45, depth) + fl * 0.015;

    // Near = bright, far = dim
    float alpha = mix(0.30, 0.04, depth) * eff;

    vec2 p = vec2(
      uv.x * cols + uv.y * cols * wind,
      uv.y * rows + time * speed
    );
    // Stagger each layer to prevent grid alignment
    p += vec2(hash1(fl * 17.3) * 137.0, hash1(fl * 31.7) * 241.0);

    vec2 cell = floor(p);
    vec2 f = fract(p);
    float h = hash(cell + fl * 113.0);

    // Density: more drops when intensity is higher
    float sparsity = mix(0.88, 0.15, eff);
    if (h < sparsity) continue;

    // Random horizontal position in cell (break grid)
    float cx = 0.12 + hash(cell + 11.0) * 0.76;
    float dx = abs(f.x - cx);

    // Streak thickness: near = thick, far = thin, per-drop variation
    float thick = mix(0.04, 0.010, depth) * (0.7 + hash(cell + 23.0) * 0.6);
    float streak = smoothstep(thick, thick * 0.06, dx);

    // Streak length + vertical taper for motion-blur look
    float len = mix(0.55, 0.18, depth) + hash(cell + 77.0) * 0.25;
    float fy = fract(f.y + h * 7.7);

    // Sharp leading edge (bottom), soft trailing fade (top = motion blur)
    float headEdge = smoothstep(0.0, 0.012, fy);
    float tailEdge = smoothstep(len, len * 0.22, fy);
    streak *= headEdge * tailEdge;

    float bright = 0.4 + hash(cell + 33.0) * 0.6;
    v += streak * alpha * bright;
  }

  // ── Splash particles along bottom ──
  if (eff > 0.25) {
    for (int s = 0; s < 16; s++) {
      float fs = float(s);
      if (fs >= 4.0 + eff * 12.0) break;

      float period = 0.3 + hash1(fs * 5.1) * 0.4;
      float cycle = floor(time / period + fs * 0.73);
      float life = fract(time / period + fs * 0.73);

      float sx = hash(vec2(fs + 1.0, cycle + 7.0));
      float sy = 0.05 * hash(vec2(cycle + 3.0, fs + 11.0)) * 0.5;

      // Tiny upward arc
      float arc = life * (1.0 - life) * 4.0;
      sy += arc * 0.025 * eff;

      vec2 dd = uv - vec2(sx, sy);
      float dist = length(dd * vec2(u_res.x / u_res.y, 1.0));
      float splashDot = smoothstep(0.006, 0.0, dist);

      float fadein = smoothstep(0.0, 0.1, life);
      float fadeout = 1.0 - smoothstep(0.5, 1.0, life);
      v += splashDot * fadein * fadeout * eff * 0.25;
    }
  }

  return v;
}

// ── Raindrops on screen glass ───────────────────────────────────────────────

vec3 glassDrops(vec2 uv, float time, float density) {
  vec3 result = vec3(0.0);
  float aspect = u_res.x / u_res.y;

  // ── Large sliding drops ──
  float numLarge = 3.0 + density * 8.0;
  for (int i = 0; i < 12; i++) {
    if (float(i) >= numLarge) break;
    float fi = float(i);

    float period = 3.5 + hash1(fi * 7.3) * 4.0;
    float phase = hash1(fi * 13.1 + 0.5) * period;
    float cycle = floor((time + phase) / period);
    float life = fract((time + phase) / period);

    // Start position: upper portion
    float baseX = 0.06 + hash(vec2(fi + 1.0, cycle + 3.0)) * 0.88;
    float baseY = 0.75 + hash(vec2(cycle + 7.0, fi + 11.0)) * 0.20;

    // Brief pause then accelerating descent
    float slideT = smoothstep(0.08, 0.9, life);
    float slideY = slideT * slideT * (0.12 + density * 0.25);

    // Subtle horizontal wander
    float sway = sin(time * (0.25 + fi * 0.015) + fi * 2.1) * 0.005
               + sin(life * 3.14159 + fi) * 0.003;

    vec2 pos = vec2(baseX + sway, baseY - slideY);
    float radius = (0.013 + hash1(fi * 4.7 + cycle) * 0.013) * mix(0.6, 1.0, density);

    vec2 d = (uv - pos) * vec2(aspect, 1.0);

    // Teardrop head: soft ellipse slightly squished vertically
    vec2 headD = vec2(d.x * 1.05, (d.y + radius * 0.12) * 0.88);
    float head = smoothstep(radius, radius * 0.12, length(headD));

    // Neck connecting head to trail
    float neckW = radius * mix(0.38, 0.08, life);
    float neck = smoothstep(neckW, neckW * 0.15, abs(d.x));
    neck *= smoothstep(-radius * 0.12, radius * 1.6, d.y);
    neck *= 1.0 - smoothstep(radius * 0.6, radius * 2.2, d.y);

    // Trail: tapers from neck width to thin line
    float trailLen = radius * (1.8 + density * 2.2 + life * 2.0);
    float trailProgress = clamp((d.y - radius * 0.4) / max(trailLen, 0.001), 0.0, 1.0);
    float trailW = radius * mix(0.22, 0.02, trailProgress);
    float trail = smoothstep(trailW, trailW * 0.08, abs(d.x));
    trail *= smoothstep(radius * 0.25, radius * 0.8, d.y);
    trail *= 1.0 - smoothstep(radius * 0.6, radius * 0.6 + trailLen, d.y);

    float body = max(head, neck * 0.82);
    body = max(body, trail * 0.45);

    // Rim light (edge refraction)
    float edgeDist = length(d);
    float rim = smoothstep(radius * 1.05, radius * 0.48, edgeDist);
    rim -= smoothstep(radius * 0.55, radius * 0.1, edgeDist);
    rim = max(rim, 0.0) * (0.35 + life * 0.15);

    // Specular highlights: upper-left glint
    float spec = smoothstep(
      radius * 0.24, 0.0,
      length(vec2((d.x + radius * 0.26) * 2.0, (d.y - radius * 0.20) * 1.5))
    );
    // Thin line along trail center
    spec += trail * smoothstep(radius * 0.04, 0.0, abs(d.x + trailW * 0.3)) * 0.4;

    float fade = 0.65 + 0.35 * sin(fi * 8.1 + cycle);
    result.x += body * fade;
    result.y += spec * fade;
    result.z += rim * fade;
  }

  // ── Small static beaded droplets ──
  float numSmall = 6.0 + density * 14.0;
  for (int j = 0; j < 24; j++) {
    if (float(j) >= numSmall) break;
    float fj = float(j);

    float cx = hash1(fj * 3.7 + 100.0);
    float cy = hash1(fj * 5.3 + 200.0);
    float r = 0.002 + hash1(fj * 2.1 + 300.0) * 0.005;

    vec2 dd = (uv - vec2(cx, cy)) * vec2(aspect, 1.0);
    float dist = length(dd);
    float bead = smoothstep(r, r * 0.15, dist);
    float glint = smoothstep(r * 0.45, 0.0, length(dd - vec2(r * 0.3, -r * 0.3)));

    result.x += bead * 0.12;
    result.y += glint * 0.18;
  }

  return result;
}

// ── Snow ─────────────────────────────────────────────────────────────────────

float snow(vec2 uv, float time) {
  float v = 0.0;
  for (int layer = 0; layer < 4; layer++) {
    float fl = float(layer);
    float scale = 8.0 + fl * 6.0;
    float speed = 0.3 + fl * 0.15;
    float alpha = 0.5 - fl * 0.08;
    float size = 0.04 - fl * 0.006;
    vec2 p = uv * scale;
    p.y -= time * speed;
    // Horizontal sway
    p.x += sin(time * 0.5 + p.y * 0.8 + fl * 1.7) * 0.5;
    vec2 cell = floor(p);
    vec2 f = fract(p);
    float h = hash(cell);
    vec2 center = vec2(0.3 + h * 0.4, 0.3 + hash(cell + 99.0) * 0.4);
    float d = length(f - center);
    // Soft bokeh circle
    float flake = smoothstep(size, size * 0.2, d);
    v += flake * alpha;
  }
  return v;
}

// ── Stars ────────────────────────────────────────────────────────────────────

float stars(vec2 uv, float time) {
  float v = 0.0;
  vec2 p = uv * 60.0;
  vec2 cell = floor(p);
  vec2 f = fract(p);
  float h = hash(cell);
  if (h > 0.92) {
    vec2 center = vec2(hash(cell + 1.0), hash(cell + 2.0));
    float d = length(f - center);
    float twinkle = 0.5 + 0.5 * sin(time * (2.0 + h * 3.0) + h * 50.0);
    float star = smoothstep(0.06, 0.0, d) * twinkle;
    v += star * (0.4 + h * 0.6);
  }
  return v;
}

// ── Lightning ────────────────────────────────────────────────────────────────

float lightning(vec2 uv, float time) {
  // Periodic flash
  float cycle = mod(time, 6.0 + hash1(floor(time / 6.0)) * 8.0);
  float flash = 0.0;
  if (cycle < 0.08) {
    flash = 1.0;
  } else if (cycle < 0.15) {
    flash = 0.0;
  } else if (cycle < 0.22) {
    flash = 0.7;
  }

  // Bolt
  if (flash > 0.1) {
    float x = 0.4 + hash1(floor(time / 6.0)) * 0.2;
    float boltx = x;
    float d = 1.0;
    float y = uv.y;
    if (y > 0.3 && y < 0.95) {
      float ny = (y - 0.3) / 0.65;
      // Jagged path
      boltx += sin(ny * 12.0 + time * 2.0) * 0.03;
      boltx += sin(ny * 25.0) * 0.015;
      d = abs(uv.x - boltx);
      float glow = smoothstep(0.08, 0.0, d) * 0.5;
      float core = smoothstep(0.008, 0.0, d);
      return (core + glow) * flash * smoothstep(0.95, 0.6, ny);
    }
  }
  return flash * 0.15; // ambient flash
}

// ── Cloud layer ──────────────────────────────────────────────────────────────

float clouds(vec2 uv, float time, float density) {
  vec2 p = uv * vec2(3.0, 5.0);
  p.x += time * 0.04;
  float n = fbm(p);
  // Threshold for cloud coverage
  float threshold = 0.4 - density * 0.2;
  float c = smoothstep(threshold, threshold + 0.25, n);
  return c;
}

// ── Fog ──────────────────────────────────────────────────────────────────────

float fog(vec2 uv, float time) {
  vec2 p = uv * vec2(2.0, 4.0);
  p.x += time * 0.02;
  p.y += sin(time * 0.1) * 0.1;
  float n = fbm(p + fbm(p + time * 0.01));
  return n * 0.6;
}

// ── Main ─────────────────────────────────────────────────────────────────────

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float kind = u_kind;
  float night = u_night;
  float t = u_time;

  // Sky
  vec3 col = mix(skyDay(uv.y, kind), skyNight(uv.y, kind), night);

  // Cloud layers (for cloudy / rain / thunder)
  if (kind > 0.5 && kind < 6.5) {
    float density = 0.3;
    if (kind > 1.5 && kind < 5.5) density = 0.6;  // rain/drizzle/snow
    if (kind > 4.5 && kind < 5.5) density = 0.9;  // thunder
    float c = clouds(uv, t, density);
    vec3 cloudCol = mix(vec3(0.85, 0.88, 0.92), vec3(0.35, 0.38, 0.42), night);
    if (kind > 4.5 && kind < 5.5) cloudCol *= 0.4; // dark thunder clouds
    col = mix(col, cloudCol, c * 0.7);
  }

  // Sun / moon (only for clear / partly cloudy)
  if (kind < 1.5) {
    col += celestialGlow(uv, night, t);
  }

  // Golden hour ambient — tint the lower sky with sun color at dawn/dusk
  // Affects all weather types (even cloudy skies glow warm at sunset)
  if (night < 0.5) {
    float golden = 1.0 - sunPhase() * sunPhase();
    col += glowTodColor() * golden * exp(-uv.y * 3.2) * 0.12;
  }

  // Clear day: warm golden horizon + sun-area atmospheric scatter
  if (kind < 0.5 && night < 0.5) {
    float horizGlow = exp(-uv.y * 13.0) * 0.14;
    vec3 horizTint = mix(vec3(1.38, 1.10, 0.62), sunTodColor() * vec3(1.5, 1.2, 1.0), 1.0 - sunPhase() * sunPhase());
    col = mix(col, col * horizTint, horizGlow);
    float sunScatter = exp(-abs(uv.y - 0.82) * 5.5) * exp(-abs(uv.x - 0.72) * 4.0) * 0.06;
    col += sunTodColor() * sunScatter * 0.7;
  }

  // Clear night: subtle milky way band
  if (kind < 0.5 && night > 0.5) {
    float mwY    = uv.x * 0.28 + 0.38;
    float diff   = uv.y - mwY;
    float mwBand = exp(-diff * diff * 55.0);
    float mwDens = fbm(uv * vec2(9.0, 3.5) + t * 0.003);
    col += vec3(0.45, 0.55, 0.85) * mwBand * mwDens * 0.16;
  }

  // Stars (night + clear/partly)
  if (night > 0.5 && kind < 1.5) {
    float s = stars(uv, t);
    col += vec3(0.8, 0.85, 1.0) * s;
  }

  // Rain + drops on glass
  if (kind > 1.5 && kind < 3.5) {
    float intensity = kind < 2.5 ? 1.0 : 0.25; // rain vs drizzle
    float r = rain(uv, t, intensity);
    col += vec3(0.7, 0.78, 0.9) * r;
    vec3 drops = glassDrops(uv, t, intensity);
    col = mix(col, col * vec3(1.05, 1.06, 1.08), drops.x * 0.12);
    col += vec3(0.95, 0.98, 1.0) * drops.y * 0.22;
    col += vec3(0.7, 0.78, 0.9) * drops.z * 0.1;
  }

  // Thunderstorm — rain + lightning + drops on glass
  if (kind > 4.5 && kind < 5.5) {
    float r = rain(uv, t, 1.3);
    col += vec3(0.6, 0.65, 0.8) * r;
    vec3 drops = glassDrops(uv, t, 1.0);
    col = mix(col, col * vec3(1.04, 1.05, 1.07), drops.x * 0.14);
    col += vec3(0.9, 0.94, 1.0) * drops.y * 0.18;
    col += vec3(0.65, 0.72, 0.86) * drops.z * 0.12;
    float l = lightning(uv, t);
    col += vec3(0.9, 0.9, 1.0) * l;
  }

  // Snow
  if (kind > 3.5 && kind < 4.5) {
    float s = snow(uv, t);
    col += vec3(1.0) * s;
  }

  // Fog / atmosphere
  if (kind > 5.5) {
    float f = fog(uv, t);
    vec3 fogCol = mix(vec3(0.75, 0.78, 0.8), vec3(0.3, 0.32, 0.35), night);
    col = mix(col, fogCol, f);
  }

  // Vignette
  float vig = 1.0 - 0.3 * length((uv - 0.5) * vec2(1.0, 0.6));
  col *= vig;

  gl_FragColor = vec4(col, 1.0);
}
`;

// ── WebGL renderer class ─────────────────────────────────────────────────────

export class WeatherGL {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private uRes: WebGLUniformLocation;
  private uTime: WebGLUniformLocation;
  private uKind: WebGLUniformLocation;
  private uNight: WebGLUniformLocation;
  private uMoon: WebGLUniformLocation;
  private uTod: WebGLUniformLocation;
  private startTime: number;
  private raf = 0;
  private canvas: HTMLCanvasElement;
  private ro: ResizeObserver;
  private destroyed = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
    });
    if (!gl) throw new Error("WebGL not supported");
    this.gl = gl;
    this.startTime = performance.now() / 1000;

    // Compile shaders
    const vs = this.compileShader(gl.VERTEX_SHADER, VERT);
    const fs = this.compileShader(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(prog);
      gl.deleteProgram(prog);
      throw new Error(`Shader link error: ${info}`);
    }
    this.program = prog;
    // biome-ignore lint/correctness/useHookAtTopLevel: WebGL API, not a React hook
    gl.useProgram(prog);

    // Uniforms
    this.uRes = gl.getUniformLocation(prog, "u_res")!;
    this.uTime = gl.getUniformLocation(prog, "u_time")!;
    this.uKind = gl.getUniformLocation(prog, "u_kind")!;
    this.uNight = gl.getUniformLocation(prog, "u_night")!;
    this.uMoon = gl.getUniformLocation(prog, "u_moon")!;
    this.uTod = gl.getUniformLocation(prog, "u_tod")!;

    // Fullscreen quad
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Resize handling
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.resize();
  }

  private compileShader(type: number, src: string): WebGLShader {
    const gl = this.gl;
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(s);
      gl.deleteShader(s);
      throw new Error(`Shader compile error: ${info}`);
    }
    return s;
  }

  private resize() {
    const dpr = Math.min(devicePixelRatio, 2); // cap for perf
    const w = this.canvas.clientWidth * dpr;
    const h = this.canvas.clientHeight * dpr;
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
  }

  /** Start rendering loop. */
  start(kind: WeatherKind, isNight: boolean, moonPhase: number) {
    this.setWeather(kind, isNight, moonPhase);
    const loop = () => {
      if (this.destroyed) return;
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  /** Update weather without restart. */
  setWeather(kind: WeatherKind, isNight: boolean, moonPhase: number) {
    const gl = this.gl;
    // biome-ignore lint/correctness/useHookAtTopLevel: WebGL API, not a React hook
    gl.useProgram(this.program);
    gl.uniform1f(this.uKind, kindToFloat(kind));
    gl.uniform1f(this.uNight, isNight ? 1.0 : 0.0);
    gl.uniform1f(this.uMoon, moonPhase);
  }

  private draw() {
    const gl = this.gl;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    // biome-ignore lint/correctness/useHookAtTopLevel: WebGL API, not a React hook
    gl.useProgram(this.program);
    gl.uniform2f(this.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.uTime, performance.now() / 1000 - this.startTime);
    const now = new Date();
    const tod =
      (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) /
      86400;
    gl.uniform1f(this.uTod, tod);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.gl.deleteProgram(this.program);
  }
}

function kindToFloat(k: WeatherKind): number {
  switch (k) {
    case "clear":
      return 0;
    case "clouds":
      return 1;
    case "rain":
      return 2;
    case "drizzle":
      return 3;
    case "snow":
      return 4;
    case "thunderstorm":
      return 5;
    case "atmosphere":
      return 6;
  }
}
