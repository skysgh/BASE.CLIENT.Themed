/**
 * About Applet Constants
 * 
 * Platform applet for service information and attributions.
 */
import { buildAppletPaths, APPLET_CONTAINERS } from '../../../core/applets/applet-path.builder';

// Build paths using the path builder
const paths = buildAppletPaths('about', { container: APPLET_CONTAINERS.parts });

export const ABOUT_CONSTANTS = {
  name: 'about',
  displayName: 'About',
  icon: 'bx-info-circle',
  description: 'Service information and attributions',
  version: '1.0.0',

  // Path information from builder
  paths,

  // Specific routes for this applet
  routes: {
    hub: paths.fullRoute,
    licenses: `${paths.fullRoute}/licenses`,
    version: `${paths.fullRoute}/version`,
    creator: `${paths.fullRoute}/creator`,
    distributor: `${paths.fullRoute}/distributor`,
    account: `${paths.fullRoute}/account`,
  }
};

/**
 * @deprecated Use ABOUT_CONSTANTS instead
 * Kept for backward compatibility during migration
 */
export const serviceAboutConstants = ABOUT_CONSTANTS;
