import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { LoginButtonComponent } from '../components/login-button.component';
import { LogoutButtonComponent } from '../components/logout-button.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, LoginButtonComponent, LogoutButtonComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
