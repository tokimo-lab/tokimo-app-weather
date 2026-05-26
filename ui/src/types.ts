export interface WeatherResponse {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  location: WeatherLocation;
  airQuality: AirQuality | null;
}

export interface AirQuality {
  europeanAqi: number | null;
  usAqi: number | null;
  pm10: number | null;
  pm25: number | null;
  carbonMonoxide: number | null;
  nitrogenDioxide: number | null;
  sulphurDioxide: number | null;
  ozone: number | null;
  dust: number | null;
  uvIndex: number | null;
}

export interface WeatherLocation {
  name: string;
  country: string;
  lat: number;
  lon: number;
  timezoneOffset: number;
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  visibility: number;
  windSpeed: number;
  windDeg: number;
  windGust: number | null;
  clouds: number;
  weatherCode: number;
  weatherMain: string;
  weatherDescription: string;
  isDay: boolean;
  sunrise: number;
  sunset: number;
  dt: number;
  rain1h: number | null;
  snow1h: number | null;
  surfacePressure: number | null;
  uvIndex: number | null;
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDeg: number;
  clouds: number;
  pop: number;
  weatherCode: number;
  weatherMain: string;
  weatherDescription: string;
  isDay: boolean;
  rain: number | null;
  snow: number | null;
  visibility: number | null;
}

export interface DailyForecast {
  dt: number;
  tempMin: number;
  tempMax: number;
  weatherCode: number;
  weatherMain: string;
  weatherDescription: string;
  pop: number;
  windSpeed: number;
  rain: number | null;
  snow: number | null;
  sunrise: number;
  sunset: number;
  uvIndex: number | null;
}

export interface GeocodingResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string | null;
}

export interface CityEntry {
  lat: number;
  lon: number;
  name: string;
  country: string;
}

export interface WeatherSettings {
  cities: CityEntry[];
  primaryIndex: number;
}
