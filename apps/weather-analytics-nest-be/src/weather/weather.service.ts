import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CitiesService } from '../cities/cities.service';
import { CacheService } from '../cache/cache.service';
import { ComfortService } from '../comfort/comfort.service';
import { WeatherData } from './interfaces/weather-data.interface';
import { WeatherResponseDto } from './dto/weather-response.dto';
import axios from 'axios';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  private readonly apiKey = process.env.OPENWEATHER_API_KEY;
  private readonly apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(
    private readonly citiesService: CitiesService,
    private readonly comfortService: ComfortService,
    private readonly cacheService: CacheService,
  ) {}

  async findAll(): Promise<{
    cities: WeatherData[];
    count: number;
    cached: boolean;
    generatedAt: string;
  }> {
    const processedCacheKey = 'weather:analytics';

    const cachedResult =
      await this.cacheService.get<WeatherData[]>(processedCacheKey);

    if (cachedResult) {
      this.logger.log('Processed weather cache HIT');

      return {
        cities: cachedResult,
        count: cachedResult.length,
        cached: true,
        generatedAt: new Date().toISOString(),
      };
    }

    this.logger.log('Processed weather cache MISS');

    const cities = await this.citiesService.findAll();

    const results = await Promise.all(
      cities.map((city) => this.getCityWeather(city.CityCode)),
    );

    const rankedResults = results
      .sort((a, b) => b.comfortScore - a.comfortScore)
      .map((city, index) => ({
        ...city,
        rank: index + 1,
      }));

    await this.cacheService.set(processedCacheKey, rankedResults);

    return {
      cities: rankedResults,
      count: rankedResults.length,
      cached: false,
      generatedAt: new Date().toISOString(),
    };
  }

  private async getCityWeather(cityCode: string): Promise<WeatherData> {
    const cacheKey = `weather:raw:${cityCode}`;

    const cached = await this.cacheService.get<WeatherResponseDto>(cacheKey);

    let weather: WeatherResponseDto;

    if (cached) {
      this.logger.debug(`Weather cache HIT: ${cityCode}`);
      weather = cached;
    } else {
      this.logger.debug(`Weather cache MISS: ${cityCode}`);

      try {
        const response = await axios.get<WeatherResponseDto>(this.apiUrl, {
          params: {
            id: cityCode,
            appid: this.apiKey,
            units: 'metric',
          },
        });

        weather = response.data;

        await this.cacheService.set(cacheKey, weather);
      } catch (error) {
        this.logger.error(
          `OpenWeatherMap request failed for ${cityCode}, Error: ${error.message}`,
        );

        throw new InternalServerErrorException(
          'Unable to retrieve weather data',
        );
      }
    }

    const comfort = this.comfortService.calculate({
      temperature: weather.main.temp,
      humidity: weather.main.humidity,
      windSpeed: weather.wind.speed,
      cloudiness: weather.clouds.all,
    });

    return {
      cityCode,
      cityName: weather.name,
      temperature: weather.main.temp,
      feelsLike: weather.main.feels_like - 273.15,
      humidity: weather.main.humidity,
      windSpeed: weather.wind.speed,
      cloudiness: weather.clouds.all,
      pressure: weather.main.pressure,
      visibility: weather.visibility,
      weatherStatus: weather.weather[0]?.main ?? 'Unknown',
      description: weather.weather[0]?.description ?? 'Unknown',
      comfortScore: comfort.score,
      rank: 0,
    };
  }
}
