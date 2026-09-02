import { CityWeather } from './city-weather.interface';

export interface WeatherResponse {
  cities: CityWeather[];
  count: number;
  cached: boolean;
  generatedAt: string;
}
