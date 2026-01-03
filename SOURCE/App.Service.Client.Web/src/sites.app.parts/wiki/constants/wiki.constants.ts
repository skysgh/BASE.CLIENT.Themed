/**
 * Wiki Constants
 * 
 * Configuration and route constants for the wiki module.
 */

/**
 * Wiki configuration interface
 */
export interface WikiConfiguration {
  /** Whether wiki is enabled */
  enabled: boolean;
  
  /** Default namespace for new pages */
  defaultNamespace: string;
  
  /** Available namespaces with permissions */
  namespaces: WikiNamespaceConfig[];
  
  /** Base path for wiki assets (markdown files) */
  assetsBasePath: string;
  
  /** Whether to enable editing */
  editingEnabled: boolean;
  
  /** Whether to show page history */
  historyEnabled: boolean;
  
  /** Whether to enable syntax highlighting */
  syntaxHighlightingEnabled: boolean;
}

/**
 * Namespace configuration
 */
export interface WikiNamespaceConfig {
  /** Namespace slug */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Description */
  description?: string;
  
  /** Icon */
  icon?: string;
  
  /** Roles required to read (empty = public) */
  readRoles: string[];
  
  /** Roles required to edit */
  editRoles: string[];
  
  /** Whether this namespace is visible in navigation */
  visible: boolean;
}

/**
 * Wiki page status
 */
export type WikiPageStatus = 'draft' | 'pending' | 'published' | 'archived';

/**
 * Wiki constants
 */
export const WIKI_CONSTANTS = {
  /** Default configuration */
  defaultConfig: {
    enabled: true,
    defaultNamespace: 'public',
    namespaces: [
      {
        id: 'public',
        name: 'Public Documentation',
        description: 'Publicly accessible documentation',
        icon: 'bx-globe',
        readRoles: [],
        editRoles: ['wiki_editor', 'admin'],
        visible: true,
      },
      {
        id: 'internal',
        name: 'Internal Wiki',
        description: 'Internal team documentation',
        icon: 'bx-building',
        readRoles: ['user'],
        editRoles: ['wiki_editor', 'admin'],
        visible: true,
      },
      {
        id: 'admin',
        name: 'Admin Notes',
        description: 'Administrator documentation',
        icon: 'bx-shield',
        readRoles: ['admin'],
        editRoles: ['admin'],
        visible: true,
      },
    ],
    assetsBasePath: 'assets/wiki',
    editingEnabled: true,
    historyEnabled: true,
    syntaxHighlightingEnabled: true,
  } as WikiConfiguration,

  /** Route paths */
  routes: {
    hub: '/wiki',
    page: '/wiki/:namespace/:slug',
    edit: '/wiki/edit/:namespace/:slug',
    namespace: '/wiki/:namespace',
  },

  /** API endpoints */
  api: {
    pages: '/api/wiki/pages',
    page: '/api/wiki/pages/:id',
    namespaces: '/api/wiki/namespaces',
    search: '/api/wiki/search',
    content: '/api/wiki/content/:id',
  },

  /** Page statuses */
  statuses: {
    draft: { label: 'Draft', badge: 'secondary', icon: 'bx-edit' },
    pending: { label: 'Pending Review', badge: 'warning', icon: 'bx-time' },
    published: { label: 'Published', badge: 'success', icon: 'bx-check' },
    archived: { label: 'Archived', badge: 'dark', icon: 'bx-archive' },
  },
} as const;
