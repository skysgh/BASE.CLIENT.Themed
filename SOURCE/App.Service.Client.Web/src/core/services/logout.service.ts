import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from './browser/session-storage.service';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

/**
 * LogoutService
 * 
 * Unified logout coordination service.
 * 
 * PROBLEM IT SOLVES:
 * Previously logout was scattered:
 * - TopbarUser cleared sessionStorage manually
 * - OidcService cleared its own state
 * - AuthenticationService had logout()
 * - AuthfakeService had logout()
 * - No coordination between them
 * - No IdP logout support
 * 
 * SOLUTION:
 * Single service that coordinates ALL logout flows:
 * 1. Clear local auth state (all auth services)
 * 2. Clear session storage (via SessionStorageService)
 * 3. Optionally revoke tokens with IdP
 * 4. Optionally redirect to IdP logout endpoint
 * 5. Navigate to signed-out landing page
 * 
 * OIDC CONSIDERATIONS:
 * - Access tokens: Should be revoked if IdP supports it
 * - Refresh tokens: Should definitely be revoked
 * - IdP session: Can redirect to IdP logout for single logout (SLO)
 * - Without IdP logout, user may still be logged in at IdP level
 * 
 * USAGE:
 * ```typescript
 * // Simple logout (local only)
 * this.logoutService.logout();
 * 
 * // Full logout with IdP (single logout)
 * this.logoutService.logout({ redirectToIdp: true });
 * 
 * // Logout with custom redirect
 * this.logoutService.logout({ redirectUrl: '/goodbye' });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  private router = inject(Router);
  private sessionStorage = inject(SessionStorageService);
  private diagnostics = inject(SystemDiagnosticsTraceService);

  // Lazy inject auth services to avoid circular dependencies
  private getAuthService() {
    // Import dynamically to avoid circular dependency
    return import('./auth.service').then(m => m.AuthenticationService);
  }

  private getFakeAuthService() {
    return import('./authfake.service').then(m => m.AuthfakeauthenticationService);
  }

  /**
   * Perform logout
   * 
   * @param options Logout options
   * @returns Promise that resolves when logout is complete
   */
  async logout(options: LogoutOptions = {}): Promise<void> {
    this.diagnostics.info('LogoutService.logout() - Starting logout flow');

    try {
      // Step 1: Clear all session storage (auth tokens, user data)
      this.sessionStorage.clearAuthData();
      this.diagnostics.debug('LogoutService: Session storage cleared');

      // Step 2: TODO - Revoke tokens with IdP if supported
      // This would call the IdP's revocation endpoint
      // await this.revokeTokens();

      // Step 3: TODO - Redirect to IdP logout if requested
      if (options.redirectToIdp) {
        this.diagnostics.info('LogoutService: IdP logout redirect requested');
        // TODO: Get IdP logout URL from OIDC config
        // For now, just continue with local logout
        // await this.redirectToIdpLogout();
      }

      // Step 4: Navigate to signed-out page or custom URL
      const redirectUrl = options.redirectUrl || '/pages/signed-out';
      this.diagnostics.info(`LogoutService: Navigating to ${redirectUrl}`);
      
      await this.router.navigate([redirectUrl]);

    } catch (error) {
      this.diagnostics.error(`LogoutService.logout() failed: ${error}`);
      // Even if something fails, try to navigate to signed-out page
      await this.router.navigate(['/pages/signed-out']);
    }
  }

  /**
   * Emergency logout - clears everything without IdP coordination
   * Use when normal logout fails or in security-critical situations
   */
  emergencyLogout(): void {
    this.diagnostics.warn('LogoutService.emergencyLogout() - Emergency logout triggered');
    
    // Clear everything in session storage
    this.sessionStorage.clearAll();
    
    // Force navigation (replaces history)
    window.location.href = '/pages/signed-out';
  }

  /**
   * Check if user should be logged out (token expired, etc.)
   * Can be called by guards or interceptors
   */
  shouldForceLogout(): boolean {
    // TODO: Check token expiry
    // TODO: Check refresh token validity
    return false;
  }

  // ============================================
  // Future: IdP Integration
  // ============================================

  /**
   * Revoke tokens with Identity Provider
   * 
   * TODO: Implement when adding real OIDC
   * - Call IdP's token revocation endpoint
   * - Revoke both access and refresh tokens
   * - Handle revocation errors gracefully
   */
  private async revokeTokens(): Promise<void> {
    this.diagnostics.debug('LogoutService.revokeTokens() - TODO: Not implemented');
    // const accessToken = this.sessionStorage.get('access_token');
    // const refreshToken = this.sessionStorage.get('refresh_token');
    // 
    // if (accessToken) {
    //   await this.oidcService.revokeToken(accessToken, 'access_token');
    // }
    // if (refreshToken) {
    //   await this.oidcService.revokeToken(refreshToken, 'refresh_token');
    // }
  }

  /**
   * Redirect to IdP logout endpoint (Single Logout / SLO)
   * 
   * TODO: Implement when adding real OIDC
   * - Build IdP logout URL with post_logout_redirect_uri
   * - Redirect to IdP
   * - IdP will redirect back to our signed-out page
   */
  private async redirectToIdpLogout(): Promise<void> {
    this.diagnostics.debug('LogoutService.redirectToIdpLogout() - TODO: Not implemented');
    // const idpLogoutUrl = this.oidcService.getLogoutUrl();
    // window.location.href = idpLogoutUrl;
  }
}

/**
 * Logout options
 */
export interface LogoutOptions {
  /**
   * Redirect to IdP logout endpoint for single logout
   * Default: false (local logout only)
   */
  redirectToIdp?: boolean;

  /**
   * Custom redirect URL after logout
   * Default: '/pages/signed-out'
   */
  redirectUrl?: string;

  /**
   * Reason for logout (for logging)
   */
  reason?: 'user' | 'token_expired' | 'security' | 'admin';
}
