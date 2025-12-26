// Ag:
import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// ✅ NEW: Use ConfigRegistry instead of direct import
import { ConfigRegistryService } from '../services/config-registry.service';

// Auth Services
import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
/**
 * Authentication Guard
 *
 * ✅ MIGRATED: No longer imports appsConfiguration directly
 *
 * Uses ConfigRegistryService to get navigation paths.
 * This breaks circular dependency.
 *
 * Benefits:
 * ✅ No circular dependency
 * ✅ Proper tier architecture
 * ✅ Easy to test (mock registry)
 */
export class AuthGuard {
  private appsConfig: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    private configRegistry: ConfigRegistryService // ✅ NEW: Inject registry
  ) {
    // ✅ Get config from registry
    this.appsConfig = this.configRegistry.get('apps');

    // ⚠️ DEFENSIVE: If config not registered yet, provide fallback
    if (!this.appsConfig) {
      console.warn('[AuthGuard] Apps config not registered yet! Using fallback.');
      this.appsConfig = {
        navigation: {
          auth: {
            login: '/auth/login', // Fallback login path
          },
        },
        others: {
          core: {
            constants: {
              storage: {
                session: {
                  currentUser: 'currentUser', // Fallback storage key
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
        // logged in so return true
        return true;
      }
    } else {
      const currentUser = this.authFackservice.currentUserValue;
      if (currentUser) {
        // logged in so return true
        return true;
      }
      // check if user data is in storage is logged in via API.
      // ✅ DEFENSIVE: Safe navigation with optional chaining
      const storageKey =
        this.appsConfig?.others?.core?.constants?.storage?.session?.currentUser || 'currentUser';
      if (sessionStorage.getItem(storageKey)) {
        return true;
      }
    }

    // not logged in so redirect to login page with the return url
    // ✅ DEFENSIVE: Safe navigation for login path
    const loginPath = this.appsConfig?.navigation?.auth?.login || '/auth/login';
    this.router.navigate([loginPath], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // ✅ NEW: Expose appsConfiguration for backward compatibility
  public get appsConfiguration() {
    return this.appsConfig;
  }
}
