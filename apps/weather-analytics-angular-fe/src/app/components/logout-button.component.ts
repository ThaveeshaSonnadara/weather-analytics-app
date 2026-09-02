import { Component, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-logout-button',
  standalone: true,

  template: `
    <button type="button" class="logout-button" (click)="logout()">
      Sign Out
    </button>
  `,

  styles: [
    `
      .logout-button {
        padding: 11px 16px;
        border: 0;
        border-radius: 8px;
        background: #2d3748;
        color: #fc8181;
        font-weight: 600;
        cursor: pointer;
      }

      .logout-button:hover {
        background: #4a5568;
      }
    `,
  ],
})
export class LogoutButtonComponent {
  private readonly auth = inject(AuthService);

  logout(): void {
    this.auth.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }
}
