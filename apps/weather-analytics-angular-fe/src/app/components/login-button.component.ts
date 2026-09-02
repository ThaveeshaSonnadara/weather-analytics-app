import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-button',
  standalone: true,
  template: `
    <button 
      (click)="loginWithRedirect()" 
      class="button login"
    >
      Log In
    </button>
  `
})
export class LoginButtonComponent {
  private auth = inject(AuthService);
  private router = inject(Router)

  loginWithRedirect(): void {
    this.auth.loginWithRedirect({
      appState: {
        // Pass the current route so Auth0 remembers where to go back to
        target: this.router.url
      }
    });
  }
}