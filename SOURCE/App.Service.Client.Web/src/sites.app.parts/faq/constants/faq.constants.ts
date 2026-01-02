/**
 * FAQ Constants
 * 
 * Central configuration for the FAQ app.part.
 */

// ─────────────────────────────────────────────────────────────
// Default Icons
// ─────────────────────────────────────────────────────────────

export const FAQ_CATEGORY_ICONS = [
  { id: 'bx-help-circle', name: 'Help Circle', class: 'bx bx-help-circle' },
  { id: 'bx-question-mark', name: 'Question Mark', class: 'bx bx-question-mark' },
  { id: 'bx-info-circle', name: 'Info Circle', class: 'bx bx-info-circle' },
  { id: 'bx-shield', name: 'Shield', class: 'bx bx-shield' },
  { id: 'bx-lock', name: 'Lock', class: 'bx bx-lock' },
  { id: 'bx-credit-card', name: 'Credit Card', class: 'bx bx-credit-card' },
  { id: 'bx-user', name: 'User', class: 'bx bx-user' },
  { id: 'bx-cog', name: 'Settings', class: 'bx bx-cog' },
  { id: 'bx-wrench', name: 'Wrench', class: 'bx bx-wrench' },
  { id: 'bx-rocket', name: 'Rocket', class: 'bx bx-rocket' },
  { id: 'bx-book', name: 'Book', class: 'bx bx-book' },
  { id: 'bx-mobile', name: 'Mobile', class: 'bx bx-mobile' },
] as const;

export type FaqCategoryIconId = typeof FAQ_CATEGORY_ICONS[number]['id'];

// ─────────────────────────────────────────────────────────────
// Default Configuration
// ─────────────────────────────────────────────────────────────

export interface FaqConfiguration {
  /** Is FAQ module enabled? */
  enabled: boolean;
  /** Default culture for content */
  defaultCulture: string;
  /** Available cultures */
  availableCultures: string[];
  /** Maximum items to show per category in viewers */
  maxItemsPerCategory: number;
  /** Base path for API calls */
  apiBasePath: string;
  /** Base path for local JSON data */
  assetsBasePath: string;
}

export const DEFAULT_FAQ_CONFIG: FaqConfiguration = {
  enabled: true,
  defaultCulture: 'en',
  availableCultures: ['en'],
  maxItemsPerCategory: 10,
  apiBasePath: '/api/faq',
  assetsBasePath: '/assets/data/faq',
};

// ─────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────

export const FAQ_ROUTES = {
  // Public routes
  hub: '/system/faq',
  category: (id: string) => `/system/faq/category/${id}`,
  
  // Admin routes
  adminCategories: '/system/faq/admin/categories',
  adminCategoryAdd: '/system/faq/admin/categories/add',
  adminCategoryEdit: (id: string) => `/system/faq/admin/categories/${id}/edit`,
  adminItems: '/system/faq/admin/items',
  adminItemAdd: '/system/faq/admin/items/add',
  adminItemEdit: (id: string) => `/system/faq/admin/items/${id}/edit`,
};

// ─────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────

export function getIconClass(iconId: FaqCategoryIconId): string {
  const icon = FAQ_CATEGORY_ICONS.find(i => i.id === iconId);
  return icon?.class || 'bx bx-help-circle';
}
