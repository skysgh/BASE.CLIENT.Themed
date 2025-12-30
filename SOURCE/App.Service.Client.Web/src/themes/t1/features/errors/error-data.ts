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
  /**
   * HTTP error code (e.g., '401', '403', '404', '500')
   */
  code: string;

  /**
   * Translation key for error title
   * Example: 'BASE.ERRORS.404.TITLE'
   */
  titleKey: string;

  /**
   * Translation key for error description
   * Example: 'BASE.ERRORS.404.DESCRIPTION'
   */
  descriptionKey: string;

  /**
   * Icon class (boxicons or remix icons)
   * Example: 'bx-search-alt', 'ri-error-warning-line'
   */
  icon: string;

  /**
   * Image file name (in errors assets folder)
   * Example: 'error.svg', 'error400-cover.png', 'error500.png'
   */
  image: string;

  /**
   * Show "Back to Home" button
   */
  showHomeButton: boolean;

  /**
   * Show "Go Back" button (history.back)
   */
  showBackButton: boolean;

  /**
   * Button style class
   * Example: 'btn-primary', 'btn-success', 'btn-danger'
   */
  buttonClass: string;

  /**
   * Lord Icon URL (for animated icons)
   * Optional - used in some layouts
   */
  lordIconUrl?: string;

  /**
   * Lord Icon colors
   */
  lordIconColors?: string;
}

/**
 * Error page configurations indexed by error code
 * 
 * Supported codes:
 * - 000: Template/unknown error (fallback)
 * - 401: Unauthorized
 * - 403: Forbidden
 * - 404: Not Found
 * - 500: Internal Server Error
 * - 502: Bad Gateway
 * - 503: Service Unavailable
 * - offline: Network offline
 */
export const ERROR_DATA: Record<string, ErrorPageConfig> = {
  // Fallback/template error
  '000': {
    code: '000',
    titleKey: 'BASE.ERRORS.000.TITLE',
    descriptionKey: 'BASE.ERRORS.000.DESCRIPTION',
    icon: 'bx-error-circle',
    image: 'error.svg',
    showHomeButton: true,
    showBackButton: true,
    buttonClass: 'btn-primary',
    lordIconUrl: 'https://cdn.lordicon.com/usownftb.json',
    lordIconColors: 'primary:#25a0e2,secondary:#00bd9d'
  },

  // 401 Unauthorized
  '401': {
    code: '401',
    titleKey: 'BASE.ERRORS.401.TITLE',
    descriptionKey: 'BASE.ERRORS.401.DESCRIPTION',
    icon: 'bx-lock-alt',
    image: 'error.svg',
    showHomeButton: true,
    showBackButton: false,
    buttonClass: 'btn-warning',
    lordIconUrl: 'https://cdn.lordicon.com/tdrtiskw.json',
    lordIconColors: 'primary:#f7b84b,secondary:#f06548'
  },

  // 403 Forbidden
  '403': {
    code: '403',
    titleKey: 'BASE.ERRORS.403.TITLE',
    descriptionKey: 'BASE.ERRORS.403.DESCRIPTION',
    icon: 'bx-block',
    image: 'error.svg',
    showHomeButton: true,
    showBackButton: true,
    buttonClass: 'btn-danger',
    lordIconUrl: 'https://cdn.lordicon.com/tdrtiskw.json',
    lordIconColors: 'primary:#f06548,secondary:#f7b84b'
  },

  // 404 Not Found
  '404': {
    code: '404',
    titleKey: 'BASE.ERRORS.404.TITLE',
    descriptionKey: 'BASE.ERRORS.404.DESCRIPTION',
    icon: 'bx-search-alt',
    image: 'error.svg',
    showHomeButton: true,
    showBackButton: true,
    buttonClass: 'btn-success',
    lordIconUrl: 'https://cdn.lordicon.com/etwtznjn.json',
    lordIconColors: 'primary:#25a0e2,secondary:#00bd9d'
  },

  // 404-A Account Not Found (special case)
  '404-A': {
    code: '404-A',
    titleKey: 'BASE.ERRORS.404-A.TITLE',
    descriptionKey: 'BASE.ERRORS.404-A.DESCRIPTION',
    icon: 'bx-buildings',
    image: 'error.svg',
    showHomeButton: true,
    showBackButton: false,
    buttonClass: 'btn-primary',
    lordIconUrl: 'https://cdn.lordicon.com/etwtznjn.json',
    lordIconColors: 'primary:#25a0e2,secondary:#00bd9d'
  },

  // 500 Internal Server Error
  '500': {
    code: '500',
    titleKey: 'BASE.ERRORS.500.TITLE',
    descriptionKey: 'BASE.ERRORS.500.DESCRIPTION',
    icon: 'bx-error',
    image: 'error500.png',
    showHomeButton: true,
    showBackButton: false,
    buttonClass: 'btn-primary',
    lordIconUrl: 'https://cdn.lordicon.com/usownftb.json',
    lordIconColors: 'primary:#f06548,secondary:#f7b84b'
  },

  // 502 Bad Gateway
  '502': {
    code: '502',
    titleKey: 'BASE.ERRORS.502.TITLE',
    descriptionKey: 'BASE.ERRORS.502.DESCRIPTION',
    icon: 'bx-cloud-lightning',
    image: 'error500.png',
    showHomeButton: true,
    showBackButton: false,
    buttonClass: 'btn-warning',
    lordIconUrl: 'https://cdn.lordicon.com/usownftb.json',
    lordIconColors: 'primary:#f7b84b,secondary:#f06548'
  },

  // 503 Service Unavailable
  '503': {
    code: '503',
    titleKey: 'BASE.ERRORS.503.TITLE',
    descriptionKey: 'BASE.ERRORS.503.DESCRIPTION',
    icon: 'bx-power-off',
    image: 'error500.png',
    showHomeButton: true,
    showBackButton: false,
    buttonClass: 'btn-secondary',
    lordIconUrl: 'https://cdn.lordicon.com/usownftb.json',
    lordIconColors: 'primary:#6c757d,secondary:#adb5bd'
  },

  // Offline
  'offline': {
    code: 'offline',
    titleKey: 'BASE.ERRORS.000.TITLE',
    descriptionKey: 'BASE.ERRORS.000.DESCRIPTION',
    icon: 'bx-wifi-off',
    image: 'error.svg',
    showHomeButton: false,
    showBackButton: true,
    buttonClass: 'btn-info',
    lordIconUrl: 'https://cdn.lordicon.com/dpinvufc.json',
    lordIconColors: 'primary:#25a0e2,secondary:#00bd9d'
  }
};

/**
 * Get error configuration by code
 * Falls back to '000' (unknown) if code not found
 * 
 * @param code Error code from URL
 * @returns ErrorPageConfig
 */
export function getErrorConfig(code: string): ErrorPageConfig {
  return ERROR_DATA[code] || ERROR_DATA['000'];
}

/**
 * Get list of all known error codes
 * Useful for generating routes
 */
export function getKnownErrorCodes(): string[] {
  return Object.keys(ERROR_DATA);
}
