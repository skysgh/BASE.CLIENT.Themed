import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { filter, pairwise, startWith } from 'rxjs/operators';
import { AccountService } from './account.service';

/**
 * NavigationService - Account-Aware Navigation with Smart Back
 * 
 * Provides account-context-preserving navigation and intelligent back navigation.
 * 
 * SMART BACK BEHAVIOR:
 * - If user has history within the app → go back in history
 * - If user came from external link (deep URL) and is authenticated → go to Hub
 * - If user came from external link and is NOT authenticated → go to Home
 * 
 * ACCOUNT CONTEXT:
 * Automatically prefixes routes with current account ID.
 * 
 * HISTORY TRACKING:
 * - Tracks only unique pages (base path without query params) to avoid
 *   polluting history when saved views or filters change query params.
 * - When browser back() is used, we pop from our internal history.
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private accountService = inject(AccountService);
  private router = inject(Router);
  private location = inject(Location);

  /** Track navigation history within the app (base paths only, no query params) */
  private navigationHistory: string[] = [];
  private readonly MAX_HISTORY = 50;
  
  /** Flag to detect popstate (browser back/forward) */
  private isPopstate = false;

  constructor() {
    this.trackNavigationHistory();
    this.trackPopstate();
  }

  /**
   * Track browser back/forward button presses (popstate)
   */
  private trackPopstate(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe((event: NavigationStart) => {
      // 'popstate' navigationTrigger indicates browser back/forward
      this.isPopstate = event.navigationTrigger === 'popstate';
    });
  }

  /**
   * Track navigation events to build internal history
   * Only tracks base paths (without query params) to avoid history pollution.
   */
  private trackNavigationHistory(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Extract base path (without query params)
      const basePath = this.getBasePath(event.urlAfterRedirects);
      const lastBasePath = this.navigationHistory.length > 0 
        ? this.navigationHistory[this.navigationHistory.length - 1] 
        : null;
      
      // If this was a popstate (browser back/forward), remove from our history
      if (this.isPopstate) {
        // Pop the current page from history since we navigated away from it
        if (this.navigationHistory.length > 0) {
          this.navigationHistory.pop();
        }
        this.isPopstate = false;
        console.log(`[NavigationService] Popstate detected, history:`, [...this.navigationHistory]);
        return;
      }
      
      // Don't add duplicates (same base path)
      if (lastBasePath !== basePath) {
        this.navigationHistory.push(basePath);
        
        // Keep history bounded
        if (this.navigationHistory.length > this.MAX_HISTORY) {
          this.navigationHistory.shift();
        }
        
        console.log(`[NavigationService] History updated:`, [...this.navigationHistory]);
      }
    });
  }

  /**
   * Extract base path from URL (removes query params and fragment)
   */
  private getBasePath(url: string): string {
    return url.split('?')[0].split('#')[0];
  }

  /**
   * Smart back navigation
   * 
   * - If we have history within the app → go back using browser history
   * - If this is the first page (deep link) → go to appropriate default
   * 
   * @param fallbackPath Optional fallback path if no history (default: auto-detect)
   */
  async back(fallbackPath?: string): Promise<boolean> {
    // If we have more than 1 entry, we can go back using browser history
    if (this.navigationHistory.length > 1) {
      console.log(`[NavigationService] Going back in browser history`);
      // Use browser's back which properly replaces state
      this.location.back();
      return true;
    }
    
    // No history - user came from external/deep link
    // Navigate to appropriate fallback
    const target = fallbackPath || this.getDefaultFallback();
    console.log(`[NavigationService] No history, navigating to fallback: ${target}`);
    return this.navigate(target);
  }

  /**
   * Get the appropriate fallback based on authentication state
   */
  private getDefaultFallback(): string {
    // Check if user is authenticated by looking at current route context
    const currentUrl = window.location.pathname;
    const isInAuthenticatedArea = this.isAuthenticatedRoute(currentUrl);
    
    if (isInAuthenticatedArea) {
      // User is in authenticated area → go to Hub
      return 'system/hub';
    } else {
      // User is in public area → go to Home
      return '/pages/landing';
    }
  }

  /**
   * Check if a route is in an authenticated area
   */
  private isAuthenticatedRoute(pathname: string): boolean {
    const segments = pathname.split('/').filter(s => s.length > 0);
    
    // These are authenticated route prefixes
    const authenticatedPrefixes = [
      'apps',      // Domain applets
      'system',    // Platform parts (settings, messages, etc.)
      'dev',       // Developer tools (requires auth typically)
    ];
    
    // Check if any segment matches authenticated prefixes
    return segments.some(seg => authenticatedPrefixes.includes(seg));
  }

  /**
   * Check if we can go back in history
   */
  canGoBack(): boolean {
    return this.navigationHistory.length > 1;
  }

  /**
   * Get the previous URL if available
   */
  getPreviousUrl(): string | null {
    if (this.navigationHistory.length > 1) {
      return this.navigationHistory[this.navigationHistory.length - 2];
    }
    return null;
  }

  /**
   * Get account-aware URL
   * 
   * @param path Relative path (e.g., 'dashboards/main', 'auth/signin')
   * @returns Full path with account prefix if needed
   */
  getUrl(path: string): string {
    const accountId = this.accountService.getAccountId();
    
    // If path starts with '/', treat as absolute (no account prefix)
    if (path.startsWith('/')) {
      return path;
    }
    
    // Normalize path - remove leading slash for consistent handling
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    
    // Check if we're in a path-based account context
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
   */
  private isPathBasedAccountUrl(pathname: string): boolean {
    const segments = pathname.split('/').filter(s => s.length > 0);
    if (segments.length === 0) return false;
    
    const firstSegment = segments[0];
    
    // Reserved routes are not account prefixes
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
   */
  getUrlArray(path: string | string[]): string[] {
    const pathStr = Array.isArray(path) ? path.join('/') : path;
    return [this.getUrl(pathStr)];
  }

  /**
   * Navigate to account-aware URL
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
   */
  async navigateByUrl(url: string): Promise<boolean> {
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
   */
  async navigateToSignIn(returnUrl?: string): Promise<boolean> {
    const queryParams = returnUrl ? { returnUrl } : undefined;
    return this.navigate('auth/signin', queryParams);
  }

  /**
   * Navigate to sign-out landing page
   */
  async navigateToSignOut(): Promise<boolean> {
    console.log('[NavigationService] Navigating to sign-out landing page');
    return this.router.navigate(['/pages/signed-out']);
  }

  /**
   * Navigate to post-login destination for current account
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
