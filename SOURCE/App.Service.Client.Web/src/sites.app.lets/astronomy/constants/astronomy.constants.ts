/**
 * Astronomy Applet Constants
 * 
 * API endpoints and configuration for the Astronomy applet.
 * Follows the same pattern as Spike applet.
 */

/** API endpoint constants for Astronomy applet */
export const astronomyConstants = {
  id: 'Astronomy',
  
  apis: {
    /** Star Systems collection endpoint */
    starSystems: '/api/rest/app_astronomy_StarSystems',
    
    /** Planets collection endpoint */
    planets: '/api/rest/app_astronomy_Planets',
    
    /** Astronomers collection endpoint */
    astronomers: '/api/rest/app_astronomy_Astronomers',
  }
};
