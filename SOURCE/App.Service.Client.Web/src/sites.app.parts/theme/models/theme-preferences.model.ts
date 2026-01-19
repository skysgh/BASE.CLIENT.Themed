/**
 * Theme Preference Models
 */

/**
 * Available primary color options
 */
export interface ThemeColor {
  id: string;
  name: string;
  value: string;
  darkValue?: string;
}

/**
 * Predefined color palette
 */
export const THEME_COLORS: ThemeColor[] = [
  { id: 'blue', name: 'Blue', value: '#405189', darkValue: '#4b5a9e' },
  { id: 'dark-blue', name: 'Dark Blue', value: '#2a3f54', darkValue: '#3d5a80' },
  { id: 'green', name: 'Green', value: '#0ab39c', darkValue: '#13c9b1' },
  { id: 'dark-green', name: 'Dark Green', value: '#1a5f4a', darkValue: '#238c6e' },
  { id: 'red', name: 'Red', value: '#f06548', darkValue: '#f27a60' },
  { id: 'dark-red', name: 'Dark Red', value: '#a83232', darkValue: '#c94444' },
  { id: 'purple', name: 'Purple', value: '#6f42c1', darkValue: '#8458d3' },
  { id: 'orange', name: 'Orange', value: '#f7b84b', darkValue: '#f9c76d' },
  { id: 'black', name: 'Black', value: '#212529', darkValue: '#343a40' },
];

/**
 * Theme mode options
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Sidebar color options
 */
export type SidebarColor = 'light' | 'dark' | 'gradient' | 'gradient-2' | 'gradient-3' | 'gradient-4';

/**
 * Topbar color options
 */
export type TopbarColor = 'light' | 'dark';

/**
 * Layout type options
 */
export type LayoutType = 'vertical' | 'horizontal' | 'twocolumn' | 'semibox';

/**
 * Sidebar size options
 */
export type SidebarSize = 'lg' | 'md' | 'sm' | 'sm-hover';

/**
 * Browse controls layout options
 * - 'panels': Traditional inline collapsible panels (filter/sort/display stacked)
 * - 'flyout': Compact mode with search bar + flyout panel for options
 */
export type BrowseControlsLayout = 'panels' | 'flyout';

/**
 * Complete theme preferences
 */
export interface ThemePreferences {
  /** Primary color ID from THEME_COLORS */
  primaryColorId: string;
  
  /** Light or dark mode */
  mode: ThemeMode;
  
  /** Sidebar color scheme */
  sidebarColor: SidebarColor;
  
  /** Topbar color scheme */
  topbarColor: TopbarColor;
  
  /** Layout type */
  layout: LayoutType;
  
  /** Sidebar size */
  sidebarSize: SidebarSize;
  
  /** Preloader enabled */
  preloaderEnabled: boolean;
  
  /** Browse view controls layout */
  browseControlsLayout: BrowseControlsLayout;
}

/**
 * Default theme preferences
 */
export const DEFAULT_THEME_PREFERENCES: ThemePreferences = {
  primaryColorId: 'blue',
  mode: 'light',
  sidebarColor: 'dark',
  topbarColor: 'light',
  layout: 'vertical',
  sidebarSize: 'lg',
  preloaderEnabled: true,
  browseControlsLayout: 'panels'  // Default to current behavior
};
