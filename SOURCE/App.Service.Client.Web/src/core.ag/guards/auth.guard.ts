// Ag:
import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// ✅ Core tier imports (Angular-agnostic services)
import { ConfigRegistryService } from '../../core/services/config-registry.service';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { environment } from '../../environments/environment';
// ✅ UPDATED: OIDC Service from core.ag
import { OidcService } from '../auth/services/oidc.service';

@Injectable({ providedIn: 'root' })
/**
 * Authentication Guard
 * 
 * ✅ LOCATION: core.ag (Angular-specific)
 * 
 * This guard uses Angular Router and is therefore Angular-specific.
 * It belongs in core.ag, not core.
 *
 * AUTHENTICATION MODES:
 * 1. 'oidc' - Real OIDC authentication (Microsoft, Google, etc.)
 * 2. 'firebase' - Firebase authentication (legacy)
 * 3. 'fakeBackend' - Fake authentication for development
 * 
 * Set via environment.defaultauth
 */
export class AuthGuard {
  private appsConfig: any;
  
  // Inject OIDC service
  private oidcService = inject(OidcService);

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    private configRegistry: ConfigRegistryService
  ) {
    // Get config from registry
    this.appsConfig = this.configRegistry.get('apps');

    // DEFENSIVE: If config not registered yet, provide fallback
    if (!this.appsConfig) {
      console.warn('[AuthGuard] Apps config not registered yet! Using fallback.');
      this.appsConfig = {
        navigation: {
          auth: {
            login: '/auth/signin',
          },
        },
        others: {
          core: {
            constants: {
              storage: {
                session: {
                  currentUser: 'currentUser',
                },
              },
            },
          },
        },
      };
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const authMode = environment.defaultauth;

    // ============================================
    // OIDC Authentication (NEW - Real providers)
    // ============================================
    if (authMode === 'oidc') {
      if (this.oidcService.isAuthenticated()) {
        // User is authenticated
        
        // Optional: Check if token is expiring soon
        // if (this.oidcService.isTokenExpiringSoon(300)) {
        //   this.oidcService.refreshToken();
        // }
        
        return true;
      }

      // Not authenticated - redirect to login
      const loginPath = this.appsConfig?.navigation?.auth?.login || '/auth/signin';
      this.router.navigate([loginPath], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // ============================================
    // Firebase Authentication (Legacy)
    // ============================================
    if (authMode === 'firebase') {
      const currentUser = this.authenticationService.currentUser();
      if (currentUser) {
        return true;
      }
    } 
    
    // ============================================
    // Fake Backend Authentication (Development)
    // ============================================
    else {
      const currentUser = this.authFackservice.currentUserValue;
      if (currentUser) {
        return true;
      }
      // Check session storage for API login
      const storageKey =
        this.appsConfig?.others?.core?.constants?.storage?.session?.currentUser || 'currentUser';
      if (sessionStorage.getItem(storageKey)) {
        return true;
      }
    }

    // Not logged in - redirect to login with return URL
    const loginPath = this.appsConfig?.navigation?.auth?.login || '/auth/signin';
    this.router.navigate([loginPath], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Expose appsConfiguration for backward compatibility
  public get appsConfiguration() {
    return this.appsConfig;
  }
}
