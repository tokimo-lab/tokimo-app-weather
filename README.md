# Tokimo Weather App (Standalone)

Standalone weather app extracted from the main Tokimo repository.

## Structure

- `tokimo-app.toml` - App manifest (id: weather, binary: tokimo-app-weather, ui_dist: ui/dist)
- `Cargo.toml` - Rust dependencies (tokimo-bus, reqwest, chrono, percent-encoding)
- `src/` - Rust backend
  - `main.rs` - Entry point & bus client integration
  - `app_server.rs` - Axum HTTP server with UDS
  - `assets.rs` - Static asset serving (rust-embed)
  - `handlers/mod.rs` - Weather & geocoding handlers with inlined Open-Meteo & Nominatim clients
- `ui/` - React frontend
  - `package.json` - Dependencies (@tokimo/ui, @tanstack/react-query, lucide-react)
  - `vite.config.ts` - Vite build configuration
  - `src/index.tsx` - App entry point
  - `src/pages/index.tsx` - Main weather page
  - `src/types.ts` - TypeScript interfaces matching Rust DTOs
  - `src/use-weather-settings.ts` - localStorage hook for city management
  - `dist/` - Built assets (index.js, CSS)

## Backend Implementation

The handlers inline Open-Meteo and Nominatim API clients using `reqwest` directly (no rust-client-api dependency).

### Routes

- `GET /assets/{*path}` - UI assets
- `GET /weather?lat=<f64>&lon=<f64>` - Weather forecast + air quality
- `GET /geocode?q=<string>&limit=<u8>&lang=<string>` - Location search

### Cache

5-minute in-memory cache for weather responses using LazyLock + RwLock.

## Frontend Implementation

Simplified standalone app without @tokimo/sdk (removed workspace dependencies).

- Direct fetch to `/api/apps/weather/weather` and `/api/apps/weather/geocode`
- localStorage-based settings (key: `weather_settings`)
- Plain strings instead of i18n
- Minimal UI with ScrollArea, city dots, hourly/daily forecasts

## Validation

### Backend (Rust)

```bash
cargo check
```

**Status:** ✅ Passed (4 warnings about unused fields in deserialize structs - acceptable)

### Frontend

```bash
cd ui && pnpm install && pnpm build
```

**Status:** ✅ Built successfully
- Output: `dist/assets/index.js` (1.6 MB) + `main-*.css` (21 KB)
- Warnings: chunk size > 500 KB (expected for bundled React app), lightningcss @theme/@tailwind unknown (non-blocking)

## Usage

This standalone repo is ready to be integrated into a Tokimo instance:

1. Build: `cargo build --release`
2. Binary: `target/release/tokimo-app-weather`
3. UI: Pre-built in `ui/dist/`

## Notes

- **No git commits or pushes performed** (as per instructions)
- **API clients inlined** to avoid rust-client-api local path dependency
- **Frontend uses direct fetch** instead of typed SDK client (standalone app pattern)
- **Settings management** via localStorage (no integrated settings page in standalone version)

## Remaining Items

For production use, consider:

1. Add README example for localStorage weather settings format
2. Implement standalone settings UI (currently shows alert)
3. Add GitHub Actions CI for automated builds
4. Create Docker packaging if needed
5. Add tests (backend unit tests, frontend component tests)
