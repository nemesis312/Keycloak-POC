import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

export const authGuard: CanActivateFn = async () => {
  const oauthService = inject(OAuthService);

  // Intenta validar el token antes de decidir
  const hasValidToken = await oauthService.loadDiscoveryDocumentAndTryLogin();

  if (oauthService.hasValidAccessToken()) {
    return true;
  }

  oauthService.initLoginFlow();
  return false;
};