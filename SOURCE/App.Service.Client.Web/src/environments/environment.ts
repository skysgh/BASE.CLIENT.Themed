// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from "./environment.types";
import { environmentSharedCustomDev } from "./environment.custom";

export const environment: Environment = {

  // Specific to this app.
  custom: environmentSharedCustomDev,

  production: false,
  
  /**
   * Authentication method:
   * - 'fakebackend': Development fake auth (default)
   * - 'firebase': Firebase authentication
   * - 'oidc': Real OIDC providers (Microsoft, Google, etc.)
   */
  defaultauth: 'fakebackend',

  // Firebase config (used when defaultauth = 'firebase')
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  },

  /**
   * OIDC Configuration (used when defaultauth = 'oidc')
   * 
   * TO ENABLE REAL AUTHENTICATION:
   * 1. Set defaultauth: 'oidc'
   * 2. Add your provider credentials below
   * 3. Register callback URL with provider
   * 
   * See core/auth/providers/microsoft.provider.ts for Azure AD setup
   * See core/auth/providers/google.provider.ts for Google Cloud setup
   */
  oidcConfig: {
    providers: [
      // Microsoft / Azure AD
      {
        provider: 'microsoft',
        enabled: false,  // Set to true when you have credentials
        clientId: 'YOUR-AZURE-CLIENT-ID',
        redirectUri: 'http://localhost:4200/auth/callback',
        scopes: ['openid', 'profile', 'email', 'User.Read'],
        displayName: 'Microsoft',
        icon: 'ri-microsoft-fill',
        // Microsoft-specific settings
        tenantId: 'consumers',  // 'consumers' for personal, 'common' for both, or tenant ID
        authority: 'https://login.microsoftonline.com/consumers'
      },
      // Google
      {
        provider: 'google',
        enabled: false,  // Set to true when you have credentials
        clientId: 'YOUR-GOOGLE-CLIENT-ID.apps.googleusercontent.com',
        redirectUri: 'http://localhost:4200/auth/callback',
        scopes: ['openid', 'profile', 'email'],
        displayName: 'Google',
        icon: 'ri-google-fill'
      }
    ],
    allowLocalLogin: true,  // Also allow email/password login
    tokenStorage: 'session',
    callbackRoute: '/auth/callback'
  }

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
