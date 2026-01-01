/**
 * Error Page Configuration
 * 
 * Centralized configuration for all error pages.
 * Supports parameterized error pages that receive error code from URL.
 * 
 * Why centralized:
 * - DRY: One source of truth for error messages
 * - i18n: All text uses translation keys
 * - Maintainable: Add new error codes without creating new components
 * - Flexible: Different layouts can reuse same data
 * 
 * Usage:
 * Route: /errors/:code (e.g., /errors/404, /errors/500)
 * Component reads code from route, looks up in ERROR_DATA
 */

export interface ErrorPageConfig {
  /** HTTP error code (e.g., '401', '403', '404', '500') */
  code: string;

  /** Translation key for error title */
  titleKey: string;

  /** Translation key for error description */
  descriptionKey: string;

  /** Icon class (remix icons) */
  icon: string;

  /** Icon color class */
  iconColor: string;

  /** Show "Back to Home" button */
  showHomeButton: boolean;

  /** Show "Go Back" button (history.back) */
  showBackButton: boolean;

  /** Button style class */
  buttonClass: string;
}

/**
 * Error page configurations indexed by error code
 */
export const ERROR_DATA: Record<string, ErrorPageConfig> = {
  // Fallback/template error
  '000': {
    code: '000',
    titleKey: 'BASE.ERRORS.000.TITLE',
    descriptionKey: 'BASE.ERRORS.000.DESCRIPTION',
    icon: 'ri-error-warning-line',
    iconColor: 'text-primary',
    showHomeButton: true,
    showBackButton: true,
    buttonClass: 'btn-primary'
  },

  // 401 Unauthorized
  '401': {
    code: '401',
    titleKey: 'BASE.ERRORS.401.TITLE',
    descriptionKey: 'BASE.ERRORS.401.DESCRIPTION',
    icon: 'ri-lock-line',
    iconColor: 'text-warning',
    showHomeButton: true,
    showBackButton: false,
    buttonClass: 'btn-warning'
  },

  // 403 Forbidden
  '403': {
    code: '403',
    titleKey: 'BASE.ERRORS.403.TITLE',
    descriptionKey: 'BASE.ERRORS.403.DESCRIPTION',
    icon: 'ri-forbid-line',
    iconColor: 'text-danger',
    showHomeButton: true,
    showBackButton: true,
    buttonClass: 'btn-danger'
  },

  // 404 Not Found
  '404': {
    code: '404',
    titleKey: 'BASE.ERRORS.404.TITLE',
    descriptionKey: 'BASE.ERRORS.404.DESCRIPTION',
    icon: 'ri-search-line',
    iconColor: 'text-info',
    showHomeButton: true,
    showBackButton: true,
    buttonClass: 'btn-success'
  },

  // 404-A Account Not Found
  '404-A': {
    code: '404-A',
    titleKey: 'BASE.ERRORS.404-A.TITLE',
    descriptionKey: 'BASE.ERRORS.404-A.DESCRIPTION',
    icon: 'ri-building-line',
    iconColor: 'text-primary',
    showHomeButton: true,
    showBackButton: false,
    buttonClass: 'btn-primary'
  },

  // 500 Internal Server Error
  '500': {
    code: '500',
    titleKey: 'BASE.ERRORS.500.TITLE',
    descriptionKey: 'BASE.ERRORS.500.DESCRIPTION',
    icon: 'ri-server-line',
    iconColor: 'text-danger',
    showHomeButton: true,
    showBackButton: false,
    buttonClass: 'btn-primary'
  },

  // 502 Bad Gateway
  '502': {
    code: '502',
    titleKey: 'BASE.ERRORS.502.TITLE',
    descriptionKey: 'BASE.ERRORS.502.DESCRIPTION',
    icon: 'ri-cloud-off-line',
    iconColor: 'text-warning',
    showHomeButton: true,
    showBackButton: false,
    buttonClass: 'btn-warning'
  },

  // 503 Service Unavailable
  '503': {
    code: '503',
    titleKey: 'BASE.ERRORS.503.TITLE',
    descriptionKey: 'BASE.ERRORS.503.DESCRIPTION',
    icon: 'ri-plug-line',
    iconColor: 'text-secondary',
    showHomeButton: true,
    showBackButton: false,
    buttonClass: 'btn-secondary'
  },

  // Offline
  'offline': {
    code: 'offline',
    titleKey: 'BASE.ERRORS.OFFLINE.TITLE',
    descriptionKey: 'BASE.ERRORS.OFFLINE.DESCRIPTION',
    icon: 'ri-wifi-off-line',
    iconColor: 'text-info',
    showHomeButton: false,
    showBackButton: true,
    buttonClass: 'btn-info'
  }
};

/**
 * Default fallback messages (used if translation not available)
 */
export const ERROR_DEFAULTS: Record<string, { title: string; description: string }> = {
  '000': { title: 'Error', description: 'An unexpected error occurred.' },
  '401': { title: 'Unauthorized', description: 'Please sign in to access this resource.' },
  '403': { title: 'Forbidden', description: 'You don\'t have permission to access this resource.' },
  '404': { title: 'Page Not Found', description: 'The page you\'re looking for doesn\'t exist.' },
  '404-A': { title: 'Account Not Found', description: 'The requested account doesn\'t exist or has been removed.' },
  '500': { title: 'Server Error', description: 'Something went wrong on our end. Please try again later.' },
  '502': { title: 'Bad Gateway', description: 'We\'re having trouble connecting. Please try again.' },
  '503': { title: 'Service Unavailable', description: 'The service is temporarily unavailable. Please try again later.' },
  'offline': { title: 'You\'re Offline', description: 'Please check your internet connection.' }
};

/**
 * Get error configuration by code
 * Falls back to '000' (unknown) if code not found
 */
export function getErrorConfig(code: string): ErrorPageConfig {
  return ERROR_DATA[code] || ERROR_DATA['000'];
}

/**
 * Get default message for error code
 */
export function getErrorDefaults(code: string): { title: string; description: string } {
  return ERROR_DEFAULTS[code] || ERROR_DEFAULTS['000'];
}

/**
 * Get list of all known error codes
 */
export function getKnownErrorCodes(): string[] {
  return Object.keys(ERROR_DATA);
}
