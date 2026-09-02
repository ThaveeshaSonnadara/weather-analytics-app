import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { CacheModule } from '../cache/cache.module';
import { CitiesModule } from '../cities/cities.module';
import { ComfortModule } from '../comfort/comfort.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    AuthModule,
    CacheModule,
    CitiesModule,
    ComfortModule,
    WeatherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
