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
   * - getUrl('dashboards/main') when account='default' → '/dashboards/main'
   * - getUrl('dashboards/main') when account='foo' → '/foo/dashboards/main'
   * - getUrl('/dashboards/main') → '/dashboards/main' (absolute, no modification)
   */
  getUrl(path: string): string {
    // If path starts with '/' and has explicit account, don't modify
    // This allows absolute navigation when needed
    if (path.startsWith('/')) {
      return path;
    }

    const accountId = this.accountService.getAccountId();
    
    // Default account doesn't need prefix
    if (accountId === 'default') {
      return `/${path}`;
    }
    
    // Named account gets prefix
    return `/${accountId}/${path}`;
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
   * @returns Promise that resolves when navigation completes
   */
  async navigate(path: string, queryParams?: { [key: string]: any }): Promise<boolean> {
    const url = this.getUrl(path);
    console.log(`[NavigationService] Navigating to: ${url}`);
    
    if (queryParams) {
      return this.router.navigate([url], { queryParams });
    }
    return this.router.navigate([url]);
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
   * @param customPath Optional custom path (default: 'dashboards/main')
   */
  getPostLoginUrl(customPath?: string): string {
    return this.getUrl(customPath || 'dashboards/main');
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
   * Navigate to post-login destination for current account
   */
  async navigatePostLogin(): Promise<boolean> {
    return this.navigate('dashboards/main');
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
