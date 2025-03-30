
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-dashboard.component.html',
  styles: [`
    .container {
      padding: 2rem;
      max-width: 600px;
      margin: auto;
    }
    button {
      margin-top: 1rem;
    }
  `]
})
export class DashboardComponent {
  user: any;

  constructor(private auth: AuthService) {
    const claims = this.auth.identityClaims;
    this.user = claims ? {
      name: claims['name'],
      email: claims['email']
    } : null;
  }

  logout() {
    this.auth.logout();
  }
}