// Ag:
import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// ✅ Core tier imports (Angular-agnostic services)
import { ConfigRegistryService } from '../../core/services/config-registry.service';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
/**
 * Authentication Guard
 * 
 * ✅ LOCATION: core.ag (Angular-specific)
 * 
 * This guard uses Angular Router and is therefore Angular-specific.
 * It belongs in core.ag, not core.
 *
 * Uses ConfigRegistryService to get navigation paths.
 * This breaks circular dependency.
 *
 * Benefits:
 * ✅ No circular dependency
 * ✅ Proper tier architecture (Angular code in core.ag)
 * ✅ Easy to test (mock registry)
 */
export class AuthGuard {
  private appsConfig: any;

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
            login: '/auth/login',
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
    if (environment.defaultauth === 'firebase') {
      const currentUser = this.authenticationService.currentUser();
      if (currentUser) {
        return true;
      }
    } else {
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
    const loginPath = this.appsConfig?.navigation?.auth?.login || '/auth/login';
    this.router.navigate([loginPath], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Expose appsConfiguration for backward compatibility
  public get appsConfiguration() {
    return this.appsConfig;
  }
}
