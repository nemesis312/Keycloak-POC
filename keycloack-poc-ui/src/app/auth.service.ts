import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../environments/environment';

const authConfig: AuthConfig = {
  ...environment.oidc,
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private oauthService: OAuthService) {
    this.configure();
  }

  private configure() {
    this.oauthService.configure(authConfig);
  
    if (this.oauthService.hasValidAccessToken()) {
      // Token aún válido, solo limpia si hay basura en la URL
      // window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }
  
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(loggedIn => {
      if (!loggedIn || !this.oauthService.hasValidAccessToken()) {
        this.oauthService.initLoginFlow();
      } else {
        // window.history.replaceState({}, document.title, window.location.pathname);
      }
    });
  }

  logout() {
    this.oauthService.logOut();
  }

  get identityClaims() {
    return this.oauthService.getIdentityClaims();
  }

  get accessToken() {
    return this.oauthService.getAccessToken();
  }
}