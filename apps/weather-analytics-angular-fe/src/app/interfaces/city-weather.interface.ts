export interface CityWeather {
  cityCode: string;
  cityName: string;

  temperature: number;
  feelsLike?: number;

  humidity?: number;
  windSpeed?: number;
  cloudiness?: number;
  pressure?: number;
  visibility?: number;

  weatherStatus: string;
  description?: string;

  comfortScore: number;
  rank: number;
}
