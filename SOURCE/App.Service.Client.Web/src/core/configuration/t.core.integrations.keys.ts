
/**
 * This type defines what keys are required for
 * the integration of third party services.
 *
 * IMPORTANT:
 * Values are *not* provided in source code,
 * but by the [dynamic] config.json that is
 * published by pipeline, for loading
 * at startup.
 */
export type TCoreIntegrationsKeys = {
  googleAPIs: string,
  googleAnalytics: string,
  googleMaps: string;
}
