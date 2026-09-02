import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { LogoutButtonComponent } from '../components/logout-button.component';
import { WeatherService } from '../services/weather.service';
import { CityWeather } from '../interfaces/city-weather.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,

  imports: [CommonModule, LogoutButtonComponent],

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private readonly weatherService = inject(WeatherService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly auth = inject(AuthService);

  cities: CityWeather[] = [];

  loading = true;
  error: string | null = null;

  lastUpdated: Date | null = null;

  ngOnInit(): void {
    this.loadWeather(true);
  }

  loadWeather(showLoader = false): void {
    if (showLoader) {
      this.loading = true;
    }

    this.error = null;

    this.weatherService.getWeatherAnalytics().subscribe({
      next: (response) => {
        if (response.cached && this.cities.length > 0 && !showLoader) {
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        this.cities = response.cities;

        this.lastUpdated = new Date();
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Weather API error:', error);

        this.error =
          error?.error?.message ||
          'Unable to load weather information. Please try again.';

        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  getScoreClass(score: number): string {
    if (score >= 80) {
      return 'excellent';
    }

    if (score >= 60) {
      return 'good';
    }

    if (score >= 40) {
      return 'moderate';
    }

    return 'poor';
  }

  getWeatherIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'clear':
        return '☀️';

      case 'clouds':
        return '☁️';

      case 'rain':
        return '🌧️';

      case 'snow':
        return '❄️';

      case 'mist':
      case 'fog':
      case 'haze':
        return '🌫️';

      case 'thunderstorm':
        return '⛈️';

      default:
        return '🌤️';
    }
  }

  trackByCity(_index: number, city: CityWeather): string {
    return city.cityCode;
  }
}
