/**
 * Hub Constants
 * 
 * Configuration for the Hub app.part.
 */

// ─────────────────────────────────────────────────────────────
// Widget Sizes
// ─────────────────────────────────────────────────────────────

export type WidgetSize = 'small' | 'medium' | 'large' | 'full';

export const WIDGET_SIZE_CLASSES: Record<WidgetSize, string> = {
  small: 'col-12 col-md-6 col-lg-3',
  medium: 'col-12 col-md-6 col-lg-4',
  large: 'col-12 col-md-12 col-lg-6',
  full: 'col-12',
};

// ─────────────────────────────────────────────────────────────
// Default Widgets
// ─────────────────────────────────────────────────────────────

export const DEFAULT_WIDGET_IDS = [
  'spike-summary',
  'support-summary',
  'recent-activity',
  'quick-actions',
];

// ─────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────

export const HUB_ROUTES = {
  root: '/system/hub',
};
