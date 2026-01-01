// Ag:
import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// ✅ Core tier imports (Angular-agnostic services)
import { ConfigRegistryService } from '../../core/services/config-registry.service';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { NavigationService } from '../../core/services/navigation.service';
import { environment } from '../../environments/environment';
// ✅ UPDATED: OIDC Service from core.ag
import { OidcService } from '../auth/services/oidc.service';

@Injectable({ providedIn: 'root' })
/**
 * Authentication Guard
 * 
 * ✅ LOCATION: core.ag (Angular-specific)
 * ✅ ACCOUNT-AWARE: Uses NavigationService for account-context-preserving redirects
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
  
  // Inject services
  private oidcService = inject(OidcService);
  private navigationService = inject(NavigationService);

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
    console.log('[AuthGuard] canActivate called for:', state.url);
    console.log('[AuthGuard] Auth mode:', authMode);
    console.log('[AuthGuard] Current account:', this.navigationService.getCurrentAccountId());

    // ============================================
    // OIDC Authentication (NEW - Real providers)
    // ============================================
    if (authMode === 'oidc') {
      if (this.oidcService.isAuthenticated()) {
        console.log('[AuthGuard] OIDC authenticated, allowing access');
        return true;
      }

      // Not authenticated - redirect to login (account-aware)
      console.log('[AuthGuard] OIDC not authenticated, redirecting to login');
      this.navigationService.navigateToSignIn(state.url);
      return false;
    }

    // ============================================
    // Firebase Authentication (Legacy)
    // ============================================
    if (authMode === 'firebase') {
      const currentUser = this.authenticationService.currentUser();
      if (currentUser) {
        console.log('[AuthGuard] Firebase authenticated, allowing access');
        return true;
      }
    } 
    
    // ============================================
    // Fake Backend Authentication (Development)
    // ============================================
    else {
      const currentUser = this.authFackservice.currentUserValue;
      console.log('[AuthGuard] Checking fake auth - currentUserValue:', currentUser ? 'exists' : 'null');
      if (currentUser) {
        console.log('[AuthGuard] Fake auth service has user, allowing access');
        return true;
      }
      // Check session storage for API login
      const storageKey =
        this.appsConfig?.others?.core?.constants?.storage?.session?.currentUser || 'currentUser';
      const storedUser = sessionStorage.getItem(storageKey);
      console.log('[AuthGuard] Checking sessionStorage key:', storageKey, '- value exists:', storedUser ? 'yes' : 'no');
      if (storedUser) {
        console.log('[AuthGuard] Session storage has user, allowing access');
        return true;
      }
    }

    // Not logged in - redirect to login with return URL (account-aware)
    console.log('[AuthGuard] No authentication found, redirecting to login');
    this.navigationService.navigateToSignIn(state.url);
    return false;
  }

  // Expose appsConfiguration for backward compatibility
  public get appsConfiguration() {
    return this.appsConfig;
  }
}
