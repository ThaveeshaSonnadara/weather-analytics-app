import { Injectable } from '@nestjs/common';
import { ComfortResult } from './interfaces/comfort-result.interface';
import { ComfortInput } from './interfaces/comfort-input.interface';

@Injectable()
export class ComfortService {
  calculate(input: ComfortInput): ComfortResult {
    const temperatureScore = this.temperatureScore(input.temperature);
    const humidityScore = this.humidityScore(input.humidity);
    const windScore = this.windScore(input.windSpeed);
    const cloudinessScore = this.cloudinessScore(input.cloudiness);
    const pressureScore = this.pressureScore(input.pressure);

    // const comfortScore =
    //   temperatureScore * 0.4 +
    //   humidityScore * 0.3 +
    //   windScore * 0.2 +
    //   cloudinessScore * 0.1;

    const comfortScore =
      temperatureScore * 0.35 +
      humidityScore * 0.26 +
      windScore * 0.16 +
      cloudinessScore * 0.08 +
      pressureScore * 0.15;

    return {
      score: Number(this.clamp(comfortScore).toFixed(1)),
    };
  }

  private pressureScore(pressure: number) {
    try {
      // Ideal pressure in hPa(hectopascal)
      const idealPressure = 1013;
      const diff = Math.abs(pressure - idealPressure);

      return this.clamp(100 - diff * 5);
    } catch (error) {
      throw new Error(
        `Something's wrong with "pressureScore" method. ${error.message}`,
      );
    }
  }

  private temperatureScore(temperature: number): number {
    try {
      // Temperature in celcius (°C)
      const idealTemp = 24;

      const diff = Math.abs(temperature - idealTemp);

      return this.clamp(100 - diff * 5);
    } catch (error) {
      throw new Error(
        `Something's wrong with "temperatureScore" method. ${error.message}`,
      );
    }
  }

  private humidityScore(humidity: number): number {
    try {
      // Humidity in %
      const idealHumidity = 50;

      const diff = Math.abs(humidity - idealHumidity);

      return this.clamp(100 - diff * 2);
    } catch (error) {
      throw new Error(
        `Something's wrong with "humidityScore" method. ${error.message}`,
      );
    }
  }

  private windScore(windSpeed: number): number {
    try {
      // WindSpeed in metre/sec
      const idealWindSpeed = 2.5;

      const diff = Math.abs(windSpeed - idealWindSpeed);

      return this.clamp(100 - diff * 20);
    } catch (error) {
      throw new Error(
        `Something's wrong with "windScore" method. ${error.message}`,
      );
    }
  }

  private cloudinessScore(cloudiness: number): number {
    try {
      // Cloudiness in
      const idealCloudiness = 30;

      const diff = Math.abs(cloudiness - idealCloudiness);

      return this.clamp(100 - diff);
    } catch (error) {
      throw new Error(
        `Something's wrong with "cloudinessScore" method. ${error.message}`,
      );
    }
  }

  private clamp(value: number): number {
    return Math.max(0, Math.min(100, value));
  }
}
