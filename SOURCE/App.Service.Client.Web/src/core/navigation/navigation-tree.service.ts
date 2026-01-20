/**
 * Navigation Tree Service
 * 
 * Provides logical navigation hierarchy awareness.
 * 
 * Features:
 * - Tracks navigation history
 * - Resolves logical parent from tree structure
 * - Detects hyperjumps (when historical != logical)
 * - Provides navigateUp() for logical back navigation
 * 
 * Usage:
 * ```typescript
 * // Get logical parent info
 * const parent = navTreeService.getLogicalParent();
 * // { path: 'apps/system/support', labelKey: 'BASE.SUPPORT.SINGULAR', labelDefault: 'Support' }
 * 
 * // Check if user hyperjumped in
 * if (navTreeService.isHyperjumped()) {
 *   // Show "Return to X" option
 * }
 * 
 * // Navigate to logical parent
 * navTreeService.navigateUp();
 * ```
 */
import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

import { NavigationNode, NavigationContext, NavigationEntry, BreadcrumbItem } from './navigation-tree.model';
import { ROOT_NAV_TREE } from './navigation-tree.data';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationTreeService {
  private router = inject(Router);
  private accountService = inject(AccountService);
  
  /** Navigation history stack (max 50 entries) */
  private history: NavigationEntry[] = [];
  private readonly MAX_HISTORY = 50;
  
  /** Flattened tree for quick lookup (path -> node) */
  private nodeMap = new Map<string, { node: NavigationNode; parent?: NavigationNode }>();
  
  constructor() {
    this.buildNodeMap(ROOT_NAV_TREE);
    this.subscribeToRouterEvents();
  }
  
  // ─────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Get full navigation context for current location
   */
  getNavigationContext(): NavigationContext {
    const currentPath = this.getCurrentPathWithoutAccount();
    const nodeInfo = this.findNodeForPath(currentPath);
    const historicalPrevious = this.history.length > 1 
      ? this.history[this.history.length - 2]?.path 
      : undefined;
    
    let parentPath: string | undefined;
    let parentNode: NavigationNode | undefined;
    
    if (nodeInfo?.parent) {
      parentNode = nodeInfo.parent;
      parentPath = this.getFullPath(nodeInfo.parent);
    } else if (nodeInfo?.node) {
      // No parent in tree - use path heuristic (go up one level)
      const segments = currentPath.split('/').filter(s => s);
      if (segments.length > 1) {
        segments.pop();
        parentPath = segments.join('/');
      }
    }
    
    // Determine if hyperjumped
    const isHyperjumped = this.checkIsHyperjumped(historicalPrevious, parentPath);
    
    return {
      currentPath,
      currentNode: nodeInfo?.node,
      parentNode,
      parentPath,
      parentLabelKey: parentNode?.labelKey,
      parentLabelDefault: parentNode?.labelDefault,
      historicalPrevious,
      isHyperjumped,
    };
  }
  
  /**
   * Get logical parent for current location
   */
  getLogicalParent(): { path: string; labelKey: string; labelDefault: string } | null {
    const context = this.getNavigationContext();
    
    if (context.parentPath) {
      return {
        path: context.parentPath,
        labelKey: context.parentLabelKey || 'BASE.ACTIONS.BACK',
        labelDefault: context.parentLabelDefault || 'Back',
      };
    }
    
    // Fallback to hub
    return {
      path: 'apps/system/hub',
      labelKey: 'BASE.HUBS.OBJECTS.INCLUSIVE.SINGULAR',
      labelDefault: 'Hub',
    };
  }
  
  /**
   * Get where user actually came from (historical)
   */
  getHistoricalPrevious(): NavigationEntry | null {
    return this.history.length > 1 
      ? this.history[this.history.length - 2] 
      : null;
  }
  
  /**
   * Check if user hyperjumped to current location
   * (came from somewhere other than logical parent)
   */
  isHyperjumped(): boolean {
    return this.getNavigationContext().isHyperjumped;
  }
  
  /**
   * Navigate to logical parent
   * 
   * @param replaceUrl If true, replaces current URL in history (for Cancel behavior)
   */
  async navigateUp(replaceUrl = false): Promise<boolean> {
    const parent = this.getLogicalParent();
    if (!parent) {
      return this.router.navigate(['/']);
    }
    
    const url = this.buildAccountAwareUrl(parent.path);
    console.log(`[NavigationTreeService] navigateUp to: ${url}${replaceUrl ? ' (replacing)' : ''}`);
    
    return this.router.navigate([url], { replaceUrl });
  }
  
  /**
   * Navigate to historical previous (browser-back behavior)
   */
  async navigateBack(): Promise<boolean> {
    const previous = this.getHistoricalPrevious();
    if (!previous) {
      return this.navigateUp();
    }
    
    const url = this.buildAccountAwareUrl(previous.path);
    console.log(`[NavigationTreeService] navigateBack to: ${url}`);
    
    return this.router.navigate([url]);
  }
  
  /**
   * Get the navigation type for current location
   * (hub, browse, read, add, edit, delete)
   */
  getCurrentNavType(): NavigationNode['navType'] | undefined {
    const context = this.getNavigationContext();
    return context.currentNode?.navType;
  }
  
  /**
   * Check if current location is a form (add/edit/delete)
   */
  isFormView(): boolean {
    const navType = this.getCurrentNavType();
    return navType === 'add' || navType === 'edit' || navType === 'delete';
  }
  
  /**
   * Get history stack (for debugging)
   */
  getHistory(): NavigationEntry[] {
    return [...this.history];
  }
  
  // ─────────────────────────────────────────────────────────────
  // Query Params Helpers (for bookmarkable sort/filter)
  // ─────────────────────────────────────────────────────────────
  
  /**
   * Get query params for sorting
   * 
   * Usage in template:
   * ```html
   * <a [routerLink]="[]" 
   *    [queryParams]="navTree.getSortParams('date')"
   *    queryParamsHandling="merge">
   *   Date
   * </a>
   * ```
   */
  getSortParams(
    field: string, 
    currentField?: string, 
    currentOrder?: 'asc' | 'desc'
  ): { sort: string; order: 'asc' | 'desc' } {
    // If clicking same field, toggle order; otherwise default to desc
    const order = field === currentField && currentOrder === 'desc' ? 'asc' : 'desc';
    return { sort: field, order };
  }
  
  /**
   * Get query params for filtering (single value)
   * 
   * Usage in template:
   * ```html
   * <a [routerLink]="[]"
   *    [queryParams]="navTree.getFilterParam('status', 'active')"
   *    queryParamsHandling="merge">
   *   Active
   * </a>
   * ```
   */
  getFilterParam(key: string, value: string | null): { [key: string]: string | null } {
    return { [key]: value };
  }
  
  /**
   * Get query params for pagination
   */
  getPageParams(page: number): { page: number } {
    return { page };
  }
  
  /**
   * Clear all filter/sort params (return to defaults)
   */
  getClearParams(): { sort: null; order: null; page: null; [key: string]: null } {
    return { sort: null, order: null, page: null };
  }
  
  /**
   * Build full query params object for a browse view
   */
  buildBrowseParams(options: {
    sort?: string;
    order?: 'asc' | 'desc';
    page?: number;
    filters?: { [key: string]: string };
  }): { [key: string]: string | number | null } {
    const params: { [key: string]: string | number | null } = {};
    
    if (options.sort) params['sort'] = options.sort;
    if (options.order) params['order'] = options.order;
    if (options.page && options.page > 1) params['page'] = options.page;
    
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });
    }
    
      return params;
    }

    // ─────────────────────────────────────────────────────────────
    // Breadcrumb Support
    // ─────────────────────────────────────────────────────────────

    /**
     * Get breadcrumb trail for current location
     * 
     * Returns array from root to current, each with label and path.
     * The last item is marked as active.
     * 
     * @param includeHome Whether to include "Home/Hub" as first item (default: true)
     */
    getBreadcrumbs(includeHome = true): BreadcrumbItem[] {
      const currentPath = this.getCurrentPathWithoutAccount();
      const breadcrumbs: BreadcrumbItem[] = [];
    
      // Optionally add Home/Hub as root
      if (includeHome) {
        breadcrumbs.push({
          label: 'Hub',
          labelKey: 'BASE.HUBS.OBJECTS.INCLUSIVE.SINGULAR',
          path: '/system/hub',
          icon: 'bx bx-home-alt',
          active: false,
        });
      }
    
      // Walk the path segments and build breadcrumb trail
      const segments = currentPath.split('/').filter(s => s && !s.startsWith(':'));
      let accumulatedPath = '';
    
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        accumulatedPath = accumulatedPath ? `${accumulatedPath}/${segment}` : segment;
      
        // Skip reserved route prefixes for first segment (apps, system, etc.)
        if (i === 0 && this.isReservedRoutePrefix(segment)) {
          continue;
        }
      
        // Look up node in tree for label info
        const nodeInfo = this.findNodeForPath(accumulatedPath);
        const isLast = i === segments.length - 1;
      
        breadcrumbs.push({
          label: nodeInfo?.node?.labelDefault || this.formatSegmentAsLabel(segment),
          labelKey: nodeInfo?.node?.labelKey,
          path: `/${accumulatedPath}`,
          icon: nodeInfo?.node?.icon,
          active: isLast,
        });
      }
    
      return breadcrumbs;
    }

    /**
     * Get breadcrumbs as observable (reactive updates on navigation)
     */
    getBreadcrumbs$(includeHome = true): import('rxjs').Observable<BreadcrumbItem[]> {
      return this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.getBreadcrumbs(includeHome))
      );
    }

    /**
     * Check if segment is a reserved route prefix
     */
    private isReservedRoutePrefix(segment: string): boolean {
      const reserved = ['apps', 'system', 'auth', 'errors', 'pages', 'dev'];
      return reserved.includes(segment);
    }

    /**
     * Format a path segment as a human-readable label
     * e.g., 'star-systems' -> 'Star Systems'
     */
    private formatSegmentAsLabel(segment: string): string {
      return segment
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    // ─────────────────────────────────────────────────────────────
    // Private Methods
    // ─────────────────────────────────────────────────────────────

    /**
     * Subscribe to router events to track navigation
     */
  private subscribeToRouterEvents(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.recordNavigation(event.urlAfterRedirects);
    });
  }
  
  /**
   * Record navigation in history
   */
  private recordNavigation(url: string): void {
    const path = this.stripAccountPrefix(url);
    
    // Don't record duplicates
    if (this.history.length > 0 && this.history[this.history.length - 1].path === path) {
      return;
    }
    
    this.history.push({
      path,
      timestamp: Date.now(),
    });
    
    // Trim history to max size
    if (this.history.length > this.MAX_HISTORY) {
      this.history.shift();
    }
  }
  
  /**
   * Build flattened node map for quick lookup
   */
  private buildNodeMap(node: NavigationNode, parent?: NavigationNode, pathPrefix = ''): void {
    const fullPath = pathPrefix ? `${pathPrefix}/${node.path}` : node.path;
    node.fullPath = fullPath;
    
    // Store with normalized path (handle :param placeholders)
    const normalizedPath = this.normalizePathPattern(fullPath);
    this.nodeMap.set(normalizedPath, { node, parent });
    
    if (node.children) {
      for (const child of node.children) {
        this.buildNodeMap(child, node, fullPath);
      }
    }
  }
  
  /**
   * Find node for a given path
   */
  private findNodeForPath(path: string): { node: NavigationNode; parent?: NavigationNode } | undefined {
    // Direct match
    if (this.nodeMap.has(path)) {
      return this.nodeMap.get(path);
    }
    
    // Try pattern matching (for :param routes)
    for (const [pattern, info] of this.nodeMap.entries()) {
      if (this.pathMatchesPattern(path, pattern)) {
        return info;
      }
    }
    
    return undefined;
  }
  
  /**
   * Normalize path pattern (replace :id, :type etc with placeholder)
   */
  private normalizePathPattern(path: string): string {
    return path.replace(/:[^/]+/g, ':param');
  }
  
  /**
   * Check if a path matches a pattern with :param placeholders
   */
  private pathMatchesPattern(path: string, pattern: string): boolean {
    const pathSegments = path.split('/').filter(s => s);
    const patternSegments = pattern.split('/').filter(s => s);
    
    if (pathSegments.length !== patternSegments.length) {
      return false;
    }
    
    for (let i = 0; i < pathSegments.length; i++) {
      if (patternSegments[i].startsWith(':')) {
        continue; // Wildcard match
      }
      if (pathSegments[i] !== patternSegments[i]) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Get full path for a node
   */
  private getFullPath(node: NavigationNode): string {
    return node.fullPath || node.path;
  }
  
  /**
   * Check if user hyperjumped (historical != logical parent path)
   */
  private checkIsHyperjumped(historicalPath?: string, logicalPath?: string): boolean {
    if (!historicalPath || !logicalPath) {
      return false;
    }
    
    // Normalize both paths for comparison
    const normalizedHistorical = this.normalizePathPattern(historicalPath);
    const normalizedLogical = this.normalizePathPattern(logicalPath);
    
    // Check if historical is the logical parent or ancestor
    if (normalizedHistorical === normalizedLogical) {
      return false;
    }
    
    // Check if historical is an ancestor of logical
    if (normalizedLogical.startsWith(normalizedHistorical + '/')) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Get current path without account prefix
   */
  private getCurrentPathWithoutAccount(): string {
    return this.stripAccountPrefix(this.router.url);
  }
  
  /**
   * Strip account prefix from URL
   */
  private stripAccountPrefix(url: string): string {
    const segments = url.split('/').filter(s => s);
    if (segments.length === 0) return '';
    
    // Check if first segment is an account prefix
    const reservedRoutes = [
      'pages', 'apps', 'auth', 'errors', 'assets', 'api',
      'dashboards', 'dev', 'system', 'landing', 'information'
    ];
    
    if (!reservedRoutes.includes(segments[0])) {
      // First segment is account - remove it
      segments.shift();
    }
    
    return segments.join('/');
  }
  
  /**
   * Build account-aware URL
   */
  private buildAccountAwareUrl(path: string): string {
    const accountId = this.accountService.getAccountId();
    const currentUrl = window.location.pathname;
    const hasAccountPrefix = this.hasAccountPrefix(currentUrl);
    
    if (hasAccountPrefix) {
      return `/${accountId}/${path}`;
    }
    
    return `/${path}`;
  }
  
  /**
   * Check if URL has account prefix
   */
  private hasAccountPrefix(pathname: string): boolean {
    const segments = pathname.split('/').filter(s => s.length > 0);
    if (segments.length === 0) return false;
    
    const reservedRoutes = [
      'pages', 'apps', 'auth', 'errors', 'assets', 'api',
      'dashboards', 'dev', 'system', 'landing', 'information'
    ];
    
    return !reservedRoutes.includes(segments[0]);
  }
}
