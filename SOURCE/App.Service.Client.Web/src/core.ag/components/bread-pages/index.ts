/**
 * BREAD Page Wrapper Components
 * 
 * Standardized "chrome" for BREAD views that isolates applet developers
 * from layout/chrome complexity. They only focus on content.
 * 
 * COMPONENTS:
 * - BrowsePageComponent: List/browse views
 * - ReadPageComponent: Detail/view pages
 * - EditPageComponent: Edit/Add forms
 * 
 * USAGE:
 * ```typescript
 * import { 
 *   BrowsePageComponent, 
 *   ReadPageComponent, 
 *   EditPageComponent 
 * } from '@core.ag/components/bread-pages';
 * ```
 */
export * from './browse-page/browse-page.component';
export * from './read-page/read-page.component';
export * from './edit-page/edit-page.component';
