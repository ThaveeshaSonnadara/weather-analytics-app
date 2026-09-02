import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { CitiesModule } from '../cities/cities.module';
import { ComfortModule } from '../comfort/comfort.module';
import { CacheModule } from '../cache/cache.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CitiesModule, ComfortModule, CacheModule, AuthModule],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
