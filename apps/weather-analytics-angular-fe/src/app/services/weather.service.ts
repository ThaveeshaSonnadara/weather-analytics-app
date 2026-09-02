import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { WeatherResponse } from '../interfaces/weather-response.interface';

@Service()
export class WeatherService {
  private httpClient = inject(HttpClient);
  private auth = inject(AuthService);

  private readonly apiUrl = environment.apiUrl;

  getWeatherAnalytics(): Observable<WeatherResponse> {
    return this.httpClient.get<WeatherResponse>(`${this.apiUrl}/weather`);
  }
}
