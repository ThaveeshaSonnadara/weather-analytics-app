export class WeatherResponseDto {
  weather: Array<{
    main: string;
    description: string;
  }>;

  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
  };

  visibility: number;

  wind: {
    speed: number;
  };

  clouds: {
    all: number;
  };

  id: string;
  name: string;
}
