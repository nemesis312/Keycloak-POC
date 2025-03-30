export const environment = {
    production: false,
    oidc: {
      issuer: 'http://localhost:8080/realms/POC',
      redirectUri: window.location.origin,
      clientId: 'angular-client',
      responseType: 'code',
      scope: 'openid profile email',
      requireHttps: false,
      showDebugInformation: true,
    },
  };