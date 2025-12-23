import { EnvironmentCustom } from './environment.types';

/**
 * Custom environment settings shared between all environments
 * (dev, prod) defined after it, further down this page.
 *
 * The reason for this file being separated is promarily
 * are these values are not overridden by merging over environment
 * with template update or similar stupid move. 
 */
const environmentCustomShared: EnvironmentCustom = {
  /**
   * Name of the file that is imported at startup
   * to override config settings.
   * See /src/config.syntax.ts to see what can be overridden.
   */
  configFileUrl: '/config.json',

  diagnostics: {
    // 5=Debug, 4=Verbose, 3=Info, 2=Warn, 1=Error
    level: 5
  },

  service: {
    // type is 'soul','json-server' or '.net.core'
    // and have to run 'npm run soul', 'npm run json-server' or start the .net.core service.
    // it changes the way query endpoints are built in systemQueryEndpoints.cs
    type: 'json-server',
  },

  urls: {
    /**
     * URLs for End User Navigation between views.
     */
    navigation: {
      /**
       * Navigation is always relative to the same server
       */
      root: '/',

      /**
       * Root folder for tiers.
       * eg: core, sites, apps
       * {0} = tier name (e.g., 'core', 'sites', 'apps.main')
       */
      section: '/{0}/',

      /** 
       * For Applets under the Applets section.
       * Applets use nested paths: /applets/{applet-name}/
       * {0} = applet name (e.g., 'education', 'spike')
       */
      appletSection: '/applets/{0}/'
    },

    /**
     * URL Fragments for retrieving static *deployed* Assets
     * Assets use filesystem paths with slashes.
     */
    assets: {
        /**
         * '/assets/{0}/deployed/'
         * 
         * Static deployed assets (configs, fonts, icons) per tier.
         * {0} = tier path (e.g., 'core', 'sites', 'apps.main', 'app.lets/education')
         * 
         * Note: Applets use slash notation for filesystem paths
         */
        deployed: '/assets/{0}/deployed/',
    },

    /**
     * URL Fragments for retrieving dynamic *user (operator/customer) persisted* Media.
     * Media uses filesystem paths with slashes.
     */
    media: {
      /**
        * '/assets/{0}/media/open/'
        * 
       * User media (images, logos) organized by tier for clear ownership.
       * {0} = tier path (e.g., 'core', 'sites', 'apps.main', 'app.lets/education')
       * 
       * Note: Applets use slash notation for filesystem paths
       */
      open: '/assets/{0}/media/open/',
      /**
        * '/assets/{0}/media/sensitive/'
        * 
       * Sensitive user media per tier.
       * {0} = tier path (e.g., 'core', 'sites', 'apps.main', 'app.lets/education')
       */
      sensitive: '/assets/{0}/media/sensitive/',
    },

    /**
     * URL Fragments for retrieving mock/test data.
     * Data uses filesystem paths with slashes.
     */
    data: {
      /**
       * '/assets/{0}/data/'
       * 
       * Mock/test data organized by tier.
       * {0} = tier path (e.g., 'core', 'sites', 'apps.main', 'app.lets/education')
       */
      open: '/assets/{0}/data/',
    },

    /**
     * URL fragments for retrieving APIs.
     * APIs use DOT notation (no slashes in segment) for routing.
     * It is important to note that while APIs
     * often come from the same server...
     * it's not guaranteed.
     */
    apis: {
      /**
       * '/api/'
       * Root of all API endpoints
       */
      root: '/api/',

      /**
       * '{0}/'
       * API segment identifier (uses DOT notation for applets)
       * {0} = tier identifier (e.g., 'core', 'sites', 'apps.main', 'app.lets.education')
       * 
       * Note: Applets use DOT notation (e.g., 'app.lets.education')
       *       to avoid nested route segments in API paths
       */
      section: '{0}/',

      /**
       * '/api/{0}/'
       * Full API path prefix
       * {0} = tier identifier (e.g., 'core', 'sites', 'apps.main', 'app.lets.education')
       */
      fullPrefix: '/api/{0}/'
    }
  }
}

/**
 * Custom environment for development.
 */
export const environmentSharedCustomDev: EnvironmentCustom = {
  ...environmentCustomShared
}

/**
 * Custom environment for testing.
 */
export const environmentSharedCustomTest: EnvironmentCustom = {
  ...environmentCustomShared,
  // TODO: Add test-specific overrides
}

/**
 * Custom environment for production.
 */
export const environmentSharedCustomProd: EnvironmentCustom = {
  ...environmentCustomShared,
  diagnostics: {
    level: 3
  }
}
