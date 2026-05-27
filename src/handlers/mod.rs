use axum::{
    extract::{Query, State},
    http::StatusCode,
    response::{IntoResponse, Json, Response},
};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    sync::{Arc, LazyLock},
    time::{Duration, Instant},
};
use tokio::sync::RwLock;

pub struct AppState {
    pub http_client: reqwest::Client,
}

const CACHE_TTL_SECS: u64 = 300;

struct CacheEntry {
    data: WeatherResponse,
    created_at: Instant,
}

static WEATHER_CACHE: LazyLock<RwLock<HashMap<String, CacheEntry>>> = LazyLock::new(|| RwLock::new(HashMap::new()));

fn cache_key(lat: f64, lon: f64) -> String {
    format!("{lat:.2},{lon:.2}")
}

#[derive(Deserialize)]
pub struct WeatherQuery {
    pub lat: f64,
    pub lon: f64,
}

#[derive(Deserialize)]
pub struct GeocodingQuery {
    pub q: String,
    #[serde(default = "default_limit")]
    pub limit: u8,
    #[serde(default = "default_lang")]
    pub lang: String,
}

fn default_lang() -> String {
    "zh".to_string()
}

fn default_limit() -> u8 {
    5
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct WeatherResponse {
    pub current: CurrentWeather,
    pub hourly: Vec<HourlyForecast>,
    pub daily: Vec<DailyForecast>,
    pub location: WeatherLocation,
    pub air_quality: Option<AirQuality>,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AirQuality {
    pub european_aqi: Option<f64>,
    pub us_aqi: Option<f64>,
    pub pm10: Option<f64>,
    pub pm2_5: Option<f64>,
    pub carbon_monoxide: Option<f64>,
    pub nitrogen_dioxide: Option<f64>,
    pub sulphur_dioxide: Option<f64>,
    pub ozone: Option<f64>,
    pub dust: Option<f64>,
    pub uv_index: Option<f64>,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct WeatherLocation {
    pub name: String,
    pub country: String,
    pub lat: f64,
    pub lon: f64,
    pub timezone_offset: i32,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CurrentWeather {
    pub temp: f64,
    pub feels_like: f64,
    pub temp_min: f64,
    pub temp_max: f64,
    pub humidity: u32,
    pub pressure: u32,
    pub visibility: u32,
    pub wind_speed: f64,
    pub wind_deg: u32,
    pub wind_gust: Option<f64>,
    pub clouds: u32,
    pub weather_code: u32,
    pub weather_main: String,
    pub weather_description: String,
    pub is_day: bool,
    pub sunrise: i64,
    pub sunset: i64,
    pub dt: i64,
    pub rain_1h: Option<f64>,
    pub snow_1h: Option<f64>,
    pub surface_pressure: Option<f64>,
    pub uv_index: Option<f64>,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct HourlyForecast {
    pub dt: i64,
    pub temp: f64,
    pub feels_like: f64,
    pub humidity: u32,
    pub pressure: u32,
    pub wind_speed: f64,
    pub wind_deg: u32,
    pub clouds: u32,
    pub pop: f64,
    pub weather_code: u32,
    pub weather_main: String,
    pub weather_description: String,
    pub is_day: bool,
    pub rain: Option<f64>,
    pub snow: Option<f64>,
    pub visibility: Option<f64>,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DailyForecast {
    pub dt: i64,
    pub temp_min: f64,
    pub temp_max: f64,
    pub weather_code: u32,
    pub weather_main: String,
    pub weather_description: String,
    pub pop: f64,
    pub wind_speed: f64,
    pub rain: Option<f64>,
    pub snow: Option<f64>,
    pub sunrise: i64,
    pub sunset: i64,
    pub uv_index: Option<f64>,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GeocodingResult {
    pub name: String,
    pub lat: f64,
    pub lon: f64,
    pub country: String,
    pub state: Option<String>,
}

#[derive(Deserialize)]
struct OmForecastResponse {
    utc_offset_seconds: i32,
    current: OmCurrent,
    hourly: OmHourly,
    daily: OmDaily,
}

#[derive(Deserialize)]
struct OmCurrent {
    time: String,
    temperature_2m: f64,
    relative_humidity_2m: f64,
    apparent_temperature: f64,
    is_day: f64,
    rain: f64,
    snowfall: f64,
    weather_code: f64,
    cloud_cover: f64,
    pressure_msl: f64,
    surface_pressure: f64,
    wind_speed_10m: f64,
    wind_direction_10m: f64,
    wind_gusts_10m: f64,
}

#[derive(Deserialize)]
struct OmHourly {
    time: Vec<String>,
    temperature_2m: Vec<f64>,
    relative_humidity_2m: Vec<f64>,
    apparent_temperature: Vec<f64>,
    precipitation_probability: Vec<f64>,
    rain: Vec<f64>,
    snowfall: Vec<f64>,
    weather_code: Vec<f64>,
    cloud_cover: Vec<f64>,
    visibility: Vec<f64>,
    wind_speed_10m: Vec<f64>,
    wind_direction_10m: Vec<f64>,
    pressure_msl: Vec<f64>,
    is_day: Vec<f64>,
}

#[derive(Deserialize)]
struct OmDaily {
    time: Vec<String>,
    weather_code: Vec<f64>,
    temperature_2m_max: Vec<f64>,
    temperature_2m_min: Vec<f64>,
    sunrise: Vec<String>,
    sunset: Vec<String>,
    rain_sum: Vec<f64>,
    snowfall_sum: Vec<f64>,
    precipitation_probability_max: Vec<f64>,
    wind_speed_10m_max: Vec<f64>,
    uv_index_max: Vec<f64>,
}

#[derive(Deserialize)]
struct OmAirQualityResponse {
    current: OmAirQualityCurrent,
}

#[derive(Deserialize)]
struct OmAirQualityCurrent {
    european_aqi: Option<f64>,
    us_aqi: Option<f64>,
    pm10: Option<f64>,
    pm2_5: Option<f64>,
    carbon_monoxide: Option<f64>,
    nitrogen_dioxide: Option<f64>,
    sulphur_dioxide: Option<f64>,
    ozone: Option<f64>,
    dust: Option<f64>,
    uv_index: Option<f64>,
}

#[derive(Deserialize)]
struct NominatimEntry {
    lat: String,
    lon: String,
    name: String,
    #[serde(default)]
    address: NominatimAddress,
}

#[derive(Deserialize, Default)]
struct NominatimAddress {
    city: Option<String>,
    town: Option<String>,
    village: Option<String>,
    municipality: Option<String>,
    state: Option<String>,
    country: Option<String>,
    country_code: Option<String>,
}

pub async fn get_weather(State(state): State<Arc<AppState>>, Query(params): Query<WeatherQuery>) -> impl IntoResponse {
    let key = cache_key(params.lat, params.lon);
    {
        let cache = WEATHER_CACHE.read().await;
        if let Some(entry) = cache.get(&key) {
            if entry.created_at.elapsed() < Duration::from_secs(CACHE_TTL_SECS) {
                return ok(entry.data.clone()).into_response();
            }
        }
    }

    let om = match fetch_forecast(&state.http_client, params.lat, params.lon).await {
        Ok(v) => v,
        Err(e) => return err_response(e),
    };

    let air_quality = fetch_air_quality(&state.http_client, params.lat, params.lon)
        .await
        .ok()
        .map(|a| AirQuality {
            european_aqi: a.current.european_aqi,
            us_aqi: a.current.us_aqi,
            pm10: a.current.pm10,
            pm2_5: a.current.pm2_5,
            carbon_monoxide: a.current.carbon_monoxide,
            nitrogen_dioxide: a.current.nitrogen_dioxide,
            sulphur_dioxide: a.current.sulphur_dioxide,
            ozone: a.current.ozone,
            dust: a.current.dust,
            uv_index: a.current.uv_index,
        });

    let today_sunrise = om.daily.sunrise.first().and_then(|s| parse_local_dt(s)).unwrap_or(0);
    let today_sunset = om.daily.sunset.first().and_then(|s| parse_local_dt(s)).unwrap_or(0);
    let today_min = om.daily.temperature_2m_min.first().copied().unwrap_or(0.0);
    let today_max = om.daily.temperature_2m_max.first().copied().unwrap_or(0.0);
    let current_dt = parse_local_dt(&om.current.time).unwrap_or(0);
    let wmo = om.current.weather_code as u32;

    let current = CurrentWeather {
        temp: om.current.temperature_2m,
        feels_like: om.current.apparent_temperature,
        temp_min: today_min,
        temp_max: today_max,
        humidity: om.current.relative_humidity_2m as u32,
        pressure: om.current.pressure_msl as u32,
        visibility: 10000,
        wind_speed: om.current.wind_speed_10m,
        wind_deg: om.current.wind_direction_10m as u32,
        wind_gust: Some(om.current.wind_gusts_10m),
        clouds: om.current.cloud_cover as u32,
        weather_code: wmo,
        weather_main: wmo_main(wmo),
        weather_description: wmo_description(wmo),
        is_day: om.current.is_day as u8 == 1,
        sunrise: today_sunrise,
        sunset: today_sunset,
        dt: current_dt,
        rain_1h: Some(om.current.rain),
        snow_1h: Some(om.current.snowfall),
        surface_pressure: Some(om.current.surface_pressure),
        uv_index: om.daily.uv_index_max.first().copied(),
    };

    let hourly_len = om.hourly.time.len().min(48);
    let hourly: Vec<HourlyForecast> = (0..hourly_len)
        .filter_map(|i| {
            let wmo = *om.hourly.weather_code.get(i)? as u32;
            Some(HourlyForecast {
                dt: parse_local_dt(om.hourly.time.get(i)?).unwrap_or(0),
                temp: *om.hourly.temperature_2m.get(i)?,
                feels_like: *om.hourly.apparent_temperature.get(i)?,
                humidity: *om.hourly.relative_humidity_2m.get(i)? as u32,
                pressure: *om.hourly.pressure_msl.get(i)? as u32,
                wind_speed: *om.hourly.wind_speed_10m.get(i)?,
                wind_deg: *om.hourly.wind_direction_10m.get(i)? as u32,
                clouds: *om.hourly.cloud_cover.get(i)? as u32,
                pop: om.hourly.precipitation_probability.get(i)? / 100.0,
                weather_code: wmo,
                weather_main: wmo_main(wmo),
                weather_description: wmo_description(wmo),
                is_day: *om.hourly.is_day.get(i)? as u8 == 1,
                rain: {
                    let r = *om.hourly.rain.get(i)?;
                    if r > 0.0 { Some(r) } else { None }
                },
                snow: {
                    let s = *om.hourly.snowfall.get(i)?;
                    if s > 0.0 { Some(s) } else { None }
                },
                visibility: Some(*om.hourly.visibility.get(i)?),
            })
        })
        .collect();

    let daily: Vec<DailyForecast> = (0..om.daily.time.len())
        .filter_map(|i| {
            let wmo = *om.daily.weather_code.get(i)? as u32;
            let rain = *om.daily.rain_sum.get(i)?;
            let snow = *om.daily.snowfall_sum.get(i)?;
            Some(DailyForecast {
                dt: parse_date_dt(om.daily.time.get(i)?).unwrap_or(0),
                temp_min: *om.daily.temperature_2m_min.get(i)?,
                temp_max: *om.daily.temperature_2m_max.get(i)?,
                weather_code: wmo,
                weather_main: wmo_main(wmo),
                weather_description: wmo_description(wmo),
                pop: om.daily.precipitation_probability_max.get(i)? / 100.0,
                wind_speed: *om.daily.wind_speed_10m_max.get(i)?,
                rain: if rain > 0.0 { Some(rain) } else { None },
                snow: if snow > 0.0 { Some(snow) } else { None },
                sunrise: parse_local_dt(om.daily.sunrise.get(i)?).unwrap_or(0),
                sunset: parse_local_dt(om.daily.sunset.get(i)?).unwrap_or(0),
                uv_index: Some(*om.daily.uv_index_max.get(i)?),
            })
        })
        .collect();

    let location = WeatherLocation {
        name: String::new(),
        country: String::new(),
        lat: params.lat,
        lon: params.lon,
        timezone_offset: om.utc_offset_seconds,
    };

    let response = WeatherResponse {
        current,
        hourly,
        daily,
        location,
        air_quality,
    };

    {
        let mut cache = WEATHER_CACHE.write().await;
        cache.insert(
            key,
            CacheEntry {
                data: response.clone(),
                created_at: Instant::now(),
            },
        );
        if cache.len() > 100 {
            cache.retain(|_, v| v.created_at.elapsed() < Duration::from_secs(CACHE_TTL_SECS));
        }
    }

    ok(response).into_response()
}

pub async fn geocode(State(state): State<Arc<AppState>>, Query(params): Query<GeocodingQuery>) -> impl IntoResponse {
    match nominatim_search(&state.http_client, &params.q, params.limit, &params.lang).await {
        Ok(entries) => {
            let results: Vec<GeocodingResult> = entries
                .into_iter()
                .filter_map(|e| {
                    let lat = e.lat.parse::<f64>().ok()?;
                    let lon = e.lon.parse::<f64>().ok()?;
                    let name = e
                        .address
                        .city
                        .or(e.address.town)
                        .or(e.address.village)
                        .or(e.address.municipality)
                        .unwrap_or(e.name);
                    let country = e.address.country.or(e.address.country_code).unwrap_or_default();
                    Some(GeocodingResult {
                        name,
                        lat,
                        lon,
                        country,
                        state: e.address.state,
                    })
                })
                .collect();
            ok(results).into_response()
        }
        Err(e) => err_response(e),
    }
}

async fn fetch_forecast(client: &reqwest::Client, lat: f64, lon: f64) -> Result<OmForecastResponse, String> {
    let url = format!(
        "https://api.open-meteo.com/v1/forecast         ?latitude={lat}&longitude={lon}         &current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,         precipitation,rain,snowfall,weather_code,cloud_cover,pressure_msl,         surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m         &hourly=temperature_2m,relative_humidity_2m,apparent_temperature,         precipitation_probability,precipitation,rain,snowfall,weather_code,         cloud_cover,visibility,wind_speed_10m,wind_direction_10m,pressure_msl,is_day         &daily=weather_code,temperature_2m_max,temperature_2m_min,         sunrise,sunset,precipitation_sum,rain_sum,snowfall_sum,         precipitation_probability_max,wind_speed_10m_max,uv_index_max         &wind_speed_unit=ms&timezone=auto&forecast_hours=48"
    );
    let resp = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Open-Meteo request failed: {e}"))?;
    if !resp.status().is_success() {
        let status = resp.status();
        let body = resp.text().await.unwrap_or_default();
        return Err(format!("Open-Meteo API error {status}: {body}"));
    }
    resp.json::<OmForecastResponse>()
        .await
        .map_err(|e| format!("Open-Meteo JSON parse error: {e}"))
}

async fn fetch_air_quality(client: &reqwest::Client, lat: f64, lon: f64) -> Result<OmAirQualityResponse, String> {
    let url = format!(
        "https://air-quality-api.open-meteo.com/v1/air-quality         ?latitude={lat}&longitude={lon}         &current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,         nitrogen_dioxide,sulphur_dioxide,ozone,dust,uv_index         &timezone=auto"
    );
    let resp = client
        .get(&url)
        .send()
        .await
        .map_err(|e| format!("Air Quality request failed: {e}"))?;
    if !resp.status().is_success() {
        let status = resp.status();
        let body = resp.text().await.unwrap_or_default();
        return Err(format!("Air Quality API error {status}: {body}"));
    }
    resp.json::<OmAirQualityResponse>()
        .await
        .map_err(|e| format!("Air Quality JSON parse error: {e}"))
}

async fn nominatim_search(
    client: &reqwest::Client,
    query: &str,
    limit: u8,
    lang: &str,
) -> Result<Vec<NominatimEntry>, String> {
    let encoded_q = percent_encoding::utf8_percent_encode(query, percent_encoding::NON_ALPHANUMERIC).to_string();
    let encoded_lang = percent_encoding::utf8_percent_encode(lang, percent_encoding::NON_ALPHANUMERIC).to_string();
    let url = format!(
        "https://nominatim.openstreetmap.org/search?q={encoded_q}&format=json&limit={limit}&accept-language={encoded_lang}&addressdetails=1"
    );
    let resp = client
        .get(&url)
        .header("User-Agent", "tokimo-weather/1.0")
        .send()
        .await
        .map_err(|e| format!("Nominatim request failed: {e}"))?;
    if !resp.status().is_success() {
        let status = resp.status();
        let body = resp.text().await.unwrap_or_default();
        return Err(format!("Nominatim API error {status}: {body}"));
    }
    resp.json::<Vec<NominatimEntry>>()
        .await
        .map_err(|e| format!("Nominatim JSON parse error: {e}"))
}

fn ok<T: Serialize>(v: T) -> Json<T> {
    Json(v)
}

fn err_response(msg: String) -> Response {
    (StatusCode::BAD_REQUEST, msg).into_response()
}

fn parse_local_dt(s: &str) -> Option<i64> {
    NaiveDateTime::parse_from_str(s, "%Y-%m-%dT%H:%M")
        .ok()
        .map(|dt| dt.and_utc().timestamp())
}

fn parse_date_dt(s: &str) -> Option<i64> {
    chrono::NaiveDate::parse_from_str(s, "%Y-%m-%d")
        .ok()
        .and_then(|d| d.and_hms_opt(12, 0, 0))
        .map(|dt| dt.and_utc().timestamp())
}

fn wmo_main(code: u32) -> String {
    match code {
        0 => "Clear",
        1 => "Mainly Clear",
        2 => "Partly Cloudy",
        3 => "Overcast",
        45 | 48 => "Fog",
        51 | 53 | 55 => "Drizzle",
        56 | 57 => "Freezing Drizzle",
        61 | 63 | 65 => "Rain",
        66 | 67 => "Freezing Rain",
        71 | 73 | 75 => "Snow",
        77 => "Snow Grains",
        80..=82 => "Rain Showers",
        85 | 86 => "Snow Showers",
        95 | 96 | 99 => "Thunderstorm",
        _ => "Unknown",
    }
    .to_string()
}

fn wmo_description(code: u32) -> String {
    match code {
        0 => "晴",
        1 => "大部晴朗",
        2 => "多云",
        3 => "阴",
        45 => "雾",
        48 => "雾凇",
        51 => "小毛毛雨",
        53 => "毛毛雨",
        55 => "大毛毛雨",
        56 => "冻毛毛雨",
        57 => "强冻毛毛雨",
        61 => "小雨",
        63 => "中雨",
        65 => "大雨",
        66 => "冻雨",
        67 => "强冻雨",
        71 => "小雪",
        73 => "中雪",
        75 => "大雪",
        77 => "雪粒",
        80 => "小阵雨",
        81 => "阵雨",
        82 => "强阵雨",
        85 => "小阵雪",
        86 => "大阵雪",
        95 => "雷暴",
        96 => "雷暴伴冰雹",
        99 => "强雷暴伴冰雹",
        _ => "未知",
    }
    .to_string()
}
