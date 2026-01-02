/**
 * Help Applet Constants
 * 
 * Platform applet for user documentation and training.
 * 
 * MODES:
 * - 'internal': Use built-in wiki-style documentation
 * - 'external': Redirect to external documentation system
 * 
 * External documentation can be:
 * - Confluence, GitBook, Notion, ReadTheDocs, etc.
 * - Custom enterprise wiki
 * - Any URL-based documentation system
 */
import { buildAppletPaths, APPLET_CONTAINERS } from '../../../core/applets/applet-path.builder';

// Build paths using the path builder
const paths = buildAppletPaths('help', { container: APPLET_CONTAINERS.parts });

/**
 * Help system mode
 */
export type HelpMode = 'internal' | 'external';

/**
 * Help configuration interface
 */
export interface HelpConfiguration {
  /** Whether help system is enabled */
  enabled: boolean;
  
  /** Mode: internal wiki or external URL */
  mode: HelpMode;
  
  /** External URL (when mode is 'external') */
  externalUrl?: string;
  
  /** Whether to open external URL in new tab */
  externalNewTab?: boolean;
  
  /** Default culture code for articles */
  defaultCulture: string;
  
  /** Available culture codes */
  availableCultures: string[];
  
  /** Base path for article assets (images, etc.) */
  assetsBasePath: string;
}

/**
 * Help constants
 */
export const HELP_CONSTANTS = {
  name: 'help',
  displayName: 'Help & Documentation',
  icon: 'bx-help-circle',
  description: 'User documentation and training materials',
  version: '1.0.0',

  // Path information from builder
  paths,

  // Default configuration (can be overridden by account config)
  defaultConfig: {
    enabled: true,
    mode: 'internal' as HelpMode,
    externalUrl: undefined,
    externalNewTab: true,
    defaultCulture: 'en',
    availableCultures: ['en'],
    assetsBasePath: 'assets/help',
  } as HelpConfiguration,

  // Specific routes for this applet
  routes: {
    hub: paths.fullRoute,
    article: `${paths.fullRoute}/article`,
    search: `${paths.fullRoute}/search`,
    category: `${paths.fullRoute}/category`,
  },

  // Article categories (can be extended)
  categories: {
    gettingStarted: 'getting-started',
    userGuide: 'user-guide',
    faq: 'faq',
    troubleshooting: 'troubleshooting',
    admin: 'admin',
    api: 'api',
  },
};

/**
 * @deprecated Use HELP_CONSTANTS instead
 */
export const helpConstants = HELP_CONSTANTS;
