import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from './account.service';

/**
 * NavigationService - Account-Aware Navigation
 * 
 * Provides account-context-preserving navigation.
 * 
 * PROBLEM:
 * Hardcoded routes like `/dashboards/main` break when user is in account context.
 * - User at `/foo/auth/signin` redirects to `/dashboards/main` → LOSES account context!
 * - Should redirect to `/foo/dashboards/main` instead.
 * 
 * SOLUTION:
 * This service automatically prefixes routes with current account ID.
 * 
 * USAGE:
 * ```typescript
 * // Instead of: this.router.navigate(['/dashboards/main']);
 * // Use: this.navigationService.navigate('dashboards/main');
 * 
 * // Or get the URL for use in templates:
 * // [routerLink]="navigationService.getUrl('auth/signin')"
 * ```
 * 
 * BEHAVIOR:
 * - Default account: `/dashboards/main` (no prefix)
 * - Named account: `/foo/dashboards/main` (with account prefix)
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private accountService = inject(AccountService);
  private router = inject(Router);

  /**
   * Get account-aware URL
   * 
   * @param path Relative path (e.g., 'dashboards/main', 'auth/signin')
   * @returns Full path with account prefix if needed
   * 
   * Examples:
   * - getUrl('dashboards/main') when account='default' → '/default/dashboards/main'
   * - getUrl('dashboards/main') when no account → '/dashboards/main'
   * - getUrl('/') or getUrl('') → account root ('/default/' or '/')
   * 
   * Note: Even the 'default' account gets a prefix when accessed via /default/ URLs.
   * Only truly anonymous routes (no account in URL) skip the prefix.
   */
  getUrl(path: string): string {
    const accountId = this.accountService.getAccountId();
    
    // Normalize path - remove leading slash for consistent handling
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    
    // Check if we're in a path-based account context
    // If the URL has an account prefix (like /default/, /foo/), preserve it
    const currentUrl = window.location.pathname;
    const hasAccountPrefix = this.isPathBasedAccountUrl(currentUrl);
    
    if (!hasAccountPrefix) {
      // No account in URL - return path without prefix
      return normalizedPath ? `/${normalizedPath}` : '/';
    }
    
    // Has account prefix - include it in the URL
    return normalizedPath ? `/${accountId}/${normalizedPath}` : `/${accountId}/`;
  }

  /**
   * Check if the current URL has an account prefix (path-based account)
   * 
   * Examples:
   * - /default/apps/spike → true (has 'default' prefix)
   * - /foo/system/hub → true (has 'foo' prefix)
   * - /pages/landing → false (no account prefix)
   * - /auth/signin → false (no account prefix)
   */
  private isPathBasedAccountUrl(pathname: string): boolean {
    const segments = pathname.split('/').filter(s => s.length > 0);
    if (segments.length === 0) return false;
    
    const firstSegment = segments[0];
    
    // Reserved routes are not account prefixes
    // These are top-level routes that don't have an account prefix
    const reservedRoutes = [
      'pages',        // Public pages (sites.anon)
      'apps',         // Domain applets (sites.app.lets)
      'system',       // Platform parts (sites.app.parts)
      'auth',         // Authentication flows
      'errors',       // Error pages
      'dev',          // Developer tools
      'assets',       // Static assets
      'api',          // API endpoints
      'dashboards',   // Legacy - redirects to system/hub
      'landing',      // Convenience redirect to pages/landing
      'information'   // Convenience redirect to pages/information
    ];
    
    return !reservedRoutes.includes(firstSegment);
  }

  /**
   * Get account-aware URL array (for routerLink)
   * 
   * @param path Relative path or path segments
   * @returns Array suitable for [routerLink]
   */
  getUrlArray(path: string | string[]): string[] {
    const pathStr = Array.isArray(path) ? path.join('/') : path;
    return [this.getUrl(pathStr)];
  }

  /**
   * Navigate to account-aware URL
   * 
   * @param path Relative path (e.g., 'dashboards/main')
   * @param queryParams Optional query parameters
   * @param options Optional navigation options (e.g., { replaceUrl: true })
   * @returns Promise that resolves when navigation completes
   */
  async navigate(
    path: string, 
    queryParams?: { [key: string]: any },
    options?: { replaceUrl?: boolean, skipLocationChange?: boolean }
  ): Promise<boolean> {
    const url = this.getUrl(path);
    console.log(`[NavigationService] Navigating to: ${url}${options?.replaceUrl ? ' (replacing)' : ''}`);
    
    const navOptions: any = { ...options };
    if (queryParams) {
      navOptions.queryParams = queryParams;
    }
    
    return this.router.navigate([url], navOptions);
  }

  /**
   * Navigate by URL (for absolute URLs or URLs with query params)
   * 
   * @param url Full URL to navigate to
   * @returns Promise that resolves when navigation completes
   */
  async navigateByUrl(url: string): Promise<boolean> {
    // If URL doesn't start with '/', assume it needs account prefix
    const fullUrl = url.startsWith('/') ? url : this.getUrl(url);
    console.log(`[NavigationService] NavigateByUrl to: ${fullUrl}`);
    return this.router.navigateByUrl(fullUrl);
  }

  /**
   * Get the sign-in URL for current account
   */
  getSignInUrl(): string {
    return this.getUrl('auth/signin');
  }

  /**
   * Get the post-login redirect URL for current account
   * 
   * @param customPath Optional custom path (default: 'system/hub')
   */
  getPostLoginUrl(customPath?: string): string {
    return this.getUrl(customPath || 'system/hub');
  }

  /**
   * Get the sign-out landing page URL for current account
   */
  getSignOutUrl(): string {
    return this.getUrl('pages/signed-out');
  }

  /**
   * Navigate to sign-in page for current account
   * 
   * @param returnUrl Optional return URL to redirect back after login
   */
  async navigateToSignIn(returnUrl?: string): Promise<boolean> {
    const queryParams = returnUrl ? { returnUrl } : undefined;
    return this.navigate('auth/signin', queryParams);
  }

  /**
   * Navigate to sign-out landing page
   * Shows app stats and navigation options instead of dumping user at login
   */
  async navigateToSignOut(): Promise<boolean> {
    console.log('[NavigationService] Navigating to sign-out landing page');
    // Use absolute path since user is logging out of account context
    return this.router.navigate(['/pages/signed-out']);
  }

  /**
   * Navigate to post-login destination for current account
   * Redirects to system hub (central landing page)
   */
  async navigatePostLogin(): Promise<boolean> {
    return this.navigate('system/hub');
  }

  /**
   * Get current account ID
   */
  getCurrentAccountId(): string {
    return this.accountService.getAccountId();
  }

  /**
   * Check if current context is default account
   */
  isDefaultAccount(): boolean {
    return this.accountService.getAccountId() === 'default';
  }
}
