/**
 * TypeScript type definitions for environment configuration
 * to enable IntelliSense and type safety across all environment files.
 */

/**
 * Configuration for diagnostic/logging settings
 */
export interface EnvironmentDiagnostics {
  /** Logging level: 5=Debug, 4=Verbose, 3=Info, 2=Warn, 1=Error */
  level: 1 | 2 | 3 | 4 | 5;
}

/**
 * Service backend configuration
 */
export interface EnvironmentService {
  /** Backend type: 'json-server', 'soul', or '.net.core' */
  type: 'json-server' | 'soul' | '.net.core';
}

/**
 * Navigation URL configuration
 */
export interface EnvironmentUrlsNavigation {
  /** Root navigation path (always relative) */
  root: string;
  /** Section template: '/{0}/' where {0} is section name */
  section: string;
  /** Applet section path */
  appletSection: string;
}

/**
 * Static assets URL configuration
 */
export interface EnvironmentUrlsAssets {
  /** Static assets template: '/{0}/assets/' */
  deployed: string;
}

/**
 * Dynamic media URL configuration
 */
export interface EnvironmentUrlsMedia {
  /** Open/public media template: '/{0}/assets.media/open/' */
  open: string;
  /** Sensitive/private media template: '/{0}/assets.media/sensitive/' */
  sensitive: string;
}

/**
 * Data URL configuration
 */
export interface EnvironmentUrlsData {
  /** Open data template: '/{0}/assets.data/' */
  open: string;
}

/**
 * API URL configuration
 */
export interface EnvironmentUrlsApis {
  /** API root path: '/api/' */
  root: string;
  /** API section template: '{0}/' */
  section: string;
  /** API section template: '/api/{0}/' */
  fullPrefix: string;
}

/**
 * All URL configurations
 */
export interface EnvironmentUrls {
  /** Navigation URLs */
  navigation: EnvironmentUrlsNavigation;
  /** Static assets URLs */
  assets: EnvironmentUrlsAssets;
  /** Dynamic media URLs */
  media: EnvironmentUrlsMedia;
  /** Data URLs */
  data: EnvironmentUrlsData;
  /** API URLs */
  apis: EnvironmentUrlsApis;
}

/**
 * Custom environment configuration (shared across dev/test/prod)
 */
export interface EnvironmentCustom {
  /** Config file URL for runtime overrides */
  configFileUrl: string;
  /** Diagnostic settings */
  diagnostics: EnvironmentDiagnostics;
  /** Service backend configuration */
  service: EnvironmentService;
  /** URL templates and fragments */
  urls: EnvironmentUrls;
}

/**
 * Firebase configuration
 */
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

/**
 * Main environment configuration interface
 */
export interface Environment {
  /** Custom application-specific configuration */
  custom: EnvironmentCustom;
  /** Production flag */
  production: boolean;
  /** Default authentication method */
  defaultauth: string;
  /** Firebase configuration */
  firebaseConfig: FirebaseConfig;
}
