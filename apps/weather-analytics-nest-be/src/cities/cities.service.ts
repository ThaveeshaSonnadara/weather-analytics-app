import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { City } from './interfaces/city.interface';
import { join } from 'path';
import { readFile } from 'fs/promises';

@Injectable()
export class CitiesService {
  private readonly logger = new Logger(CitiesService.name);

  async findAll(): Promise<City[]> {
    try {
      const filePath = join(
        process.cwd(),
        'apps',
        'weather-analytics-nest-be',
        'src',
        'data',
        'cities.json',
      );

      const file = await readFile(filePath, 'utf-8');

      return JSON.parse(file) as City[];
    } catch (error) {
      this.logger.error('Failed to read cities.json', error);

      throw new InternalServerErrorException(
        'Unable to load city configuration',
      );
    }
  }

  async getCityCodes(): Promise<string[]> {
    const cities = await this.findAll();
    return cities.map((city) => city.CityCode);
  }
}
