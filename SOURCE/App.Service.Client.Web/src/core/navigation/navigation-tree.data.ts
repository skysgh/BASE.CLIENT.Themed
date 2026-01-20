/**
 * Navigation Tree Data
 * 
 * Defines the logical navigation hierarchy.
 * This is the "map" of the application's navigation structure.
 * 
 * Used for:
 * - Determining logical parent (for back navigation)
 * - Generating breadcrumbs
 * - Detecting hyperjumps
 */
import { NavigationNode } from './navigation-tree.model';

/**
 * System app.parts navigation tree
 */
export const SYSTEM_NAV_TREE: NavigationNode = {
  path: 'apps/system',
  labelKey: 'BASE.SYSTEM.SINGULAR',
  labelDefault: 'System',
  icon: 'bx-cog',
  children: [
    // Hub - central landing
    {
      path: 'hub',
      labelKey: 'BASE.HUBS.OBJECTS.INCLUSIVE.SINGULAR',
      labelDefault: 'Hub',
      icon: 'bx-home',
      navType: 'hub',
    },
    
    // Support
    {
      path: 'support',
      labelKey: 'BASE.SUPPORT.SINGULAR',
      labelDefault: 'Support',
      icon: 'bx-support',
      navType: 'hub',
      children: [
        {
          path: 'my-items',
          labelKey: 'BASE.ITEMS.MY_ITEMS',
          labelDefault: 'My Items',
          navType: 'browse',
        },
        {
          path: 'new/:type',
          labelKey: 'BASE.ACTIONS.NEW',
          labelDefault: 'New',
          navType: 'add',
        },
        {
          path: 'item/:id',
          labelKey: 'BASE.ITEMS.SINGULAR',
          labelDefault: 'Item',
          navType: 'read',
        },
      ],
    },
    
    // Help
    {
      path: 'help',
      labelKey: 'BASE.HELP.SINGULAR',
      labelDefault: 'Help',
      icon: 'bx-help-circle',
      navType: 'hub',
      children: [
        {
          path: 'faq',
          labelKey: 'BASE.FAQ.SINGULAR',
          labelDefault: 'FAQ',
          navType: 'browse',
        },
        {
          path: 'wiki',
          labelKey: 'BASE.WIKI.SINGULAR',
          labelDefault: 'Wiki',
          navType: 'browse',
        },
        {
          path: 'article/:id',
          labelKey: 'BASE.ARTICLES.SINGULAR',
          labelDefault: 'Article',
          navType: 'read',
        },
      ],
    },
    
    // FAQ
    {
      path: 'faq',
      labelKey: 'BASE.FAQ.SINGULAR',
      labelDefault: 'FAQ',
      icon: 'bx-question-mark',
      navType: 'hub',
      children: [
        {
          path: 'category/:id',
          labelKey: 'BASE.CATEGORIES.SINGULAR',
          labelDefault: 'Category',
          navType: 'read',
        },
        {
          path: 'admin',
          labelKey: 'BASE.ADMIN.SINGULAR',
          labelDefault: 'Admin',
          navType: 'browse',
          children: [
            {
              path: 'categories',
              labelKey: 'BASE.CATEGORIES.PLURAL',
              labelDefault: 'Categories',
              navType: 'browse',
            },
            {
              path: 'category/new',
              labelKey: 'BASE.ACTIONS.NEW',
              labelDefault: 'New',
              navType: 'add',
            },
            {
              path: 'category/:id',
              labelKey: 'BASE.CATEGORIES.SINGULAR',
              labelDefault: 'Category',
              navType: 'edit',
            },
          ],
        },
      ],
    },
    
    // Surveys
    {
      path: 'surveys',
      labelKey: 'BASE.SURVEYS.SINGULAR',
      labelDefault: 'Surveys',
      icon: 'bx-poll',
      navType: 'hub',
      children: [
        {
          path: 'take/:id',
          labelKey: 'BASE.SURVEYS.TAKE',
          labelDefault: 'Take Survey',
          navType: 'add',  // Treat like a form
        },
        {
          path: 'results/:id',
          labelKey: 'BASE.RESULTS.PLURAL',
          labelDefault: 'Results',
          navType: 'read',
        },
      ],
    },
    
    // Settings
    {
      path: 'settings',
      labelKey: 'BASE.SETTINGS.PLURAL',
      labelDefault: 'Settings',
      icon: 'bx-cog',
      navType: 'hub',
    },
    
    // Authentication
    {
      path: 'authentication',
      labelKey: 'BASE.AUTHENTICATION.SINGULAR',
      labelDefault: 'Authentication',
      icon: 'bx-user',
      navType: 'hub',
      children: [
        {
          path: 'profile',
          labelKey: 'BASE.PROFILES.SINGULAR',
          labelDefault: 'Profile',
          navType: 'read',
        },
        {
          path: 'users',
          labelKey: 'BASE.USERS.PLURAL',
          labelDefault: 'Users',
          navType: 'browse',
          children: [
            {
              path: ':id',
              labelKey: 'BASE.USERS.SINGULAR',
              labelDefault: 'User',
              navType: 'read',
            },
          ],
        },
      ],
    },
    
    // About
    {
      path: 'about',
      labelKey: 'BASE.ABOUT.SINGULAR',
      labelDefault: 'About',
      icon: 'bx-info-circle',
      navType: 'hub',
    },
    
    // Diagnostics
    {
      path: 'diagnostics',
      labelKey: 'BASE.DIAGNOSTICS.SINGULAR',
      labelDefault: 'Diagnostics',
      icon: 'bx-pulse',
      navType: 'hub',
      children: [
        {
          path: 'logs',
          labelKey: 'BASE.LOGS.PLURAL',
          labelDefault: 'Logs',
          navType: 'browse',
          children: [
            {
              path: ':id',
              labelKey: 'BASE.LOGS.SINGULAR',
              labelDefault: 'Log',
              navType: 'read',
            },
          ],
        },
      ],
    },
    
    // Access
    {
      path: 'access',
      labelKey: 'BASE.ACCESS.SINGULAR',
      labelDefault: 'Access',
      icon: 'bx-globe',
      navType: 'hub',
      children: [
        {
          path: 'embargoes',
          labelKey: 'BASE.EMBARGOES.PLURAL',
          labelDefault: 'Embargoes',
          navType: 'browse',
          children: [
            {
              path: 'new',
              labelKey: 'BASE.ACTIONS.NEW',
              labelDefault: 'New',
              navType: 'add',
            },
            {
              path: ':id',
              labelKey: 'BASE.EMBARGOES.SINGULAR',
              labelDefault: 'Embargo',
              navType: 'read',
            },
            {
              path: ':id/edit',
              labelKey: 'BASE.ACTIONS.EDIT',
              labelDefault: 'Edit',
              navType: 'edit',
            },
          ],
        },
      ],
    },
  ],
};

/**
 * App.lets navigation tree (domain features)
 */
export const APPLETS_NAV_TREE: NavigationNode = {
  path: 'apps',
  labelKey: 'BASE.APPS.PLURAL',
  labelDefault: 'Apps',
  icon: 'bx-grid-alt',
  children: [
    {
      path: 'spike',
      labelKey: 'BASE.SPIKE.SINGULAR',
      labelDefault: 'Spike',
      icon: 'bx-bolt',
      navType: 'hub',
      children: [
        {
          path: '',
          labelKey: 'BASE.SPIKE.BROWSE',
          labelDefault: 'Browse',
          navType: 'browse',
        },
        {
          path: ':id',
          labelKey: 'BASE.SPIKE.SINGULAR',
          labelDefault: 'Item',
          navType: 'read',
        },
      ],
    },
  ],
};

/**
 * Root navigation tree
 */
export const ROOT_NAV_TREE: NavigationNode = {
  path: '',
  labelKey: 'BASE.HOME',
  labelDefault: 'Home',
  children: [
    SYSTEM_NAV_TREE,
    APPLETS_NAV_TREE,
  ],
};
