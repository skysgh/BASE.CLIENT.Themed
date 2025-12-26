/**
 * Sites.App Tier - Dependency Injection Tokens
 * 
 * These tokens are used by the authenticated app tier.
 * They implement interfaces defined in the parent sites/ tier.
 * 
 * Pattern:
 * - Parent (sites/types/tokens.types.ts) defines interfaces
 * - This tier creates InjectionTokens with "APP_" prefix
 * - Module provides actual values
 */

import { InjectionToken } from '@angular/core';
import {
  IDeployedResources,
  IUploadedResources,
  IApiEndpoints,
  IPublicNavigation,
  IPrivateNavigation
} from '../../sites.anon/types/tokens.types';

// ============================================================================
// APP TIER TOKENS
// ============================================================================

export const APP_DEPLOYED_RESOURCES = new InjectionToken<IDeployedResources>(
  'APP_DEPLOYED_RESOURCES',
  {
    providedIn: 'root',
    factory: () => ({
      logos: {
        light: '/media/sites.app/images/logos/logo-light.png',
        dark: '/media/sites.app/images/logos/logo-dark.png'
      },
      images: {
        root: '/media/sites.app/images/',
        trustedBy: '/media/sites.app/images/trustedby/',
        flags: '/media/sites.app/images/flags/',
        backgrounds: '/media/sites.app/images/backgrounds/'
      },
      files: {
        root: '/media/sites.app/files/',
        markdown: '/media/sites.app/files/markdown/',
        pdf: '/media/sites.app/files/pdf/'
      }
    })
  }
);

export const APP_UPLOADED_RESOURCES = new InjectionToken<IUploadedResources>(
  'APP_UPLOADED_RESOURCES'
);

export const APP_API_ENDPOINTS = new InjectionToken<IApiEndpoints>(
  'APP_API_ENDPOINTS'
);

export const APP_PUBLIC_NAVIGATION = new InjectionToken<IPublicNavigation>(
  'APP_PUBLIC_NAVIGATION'
);

export const APP_PRIVATE_NAVIGATION = new InjectionToken<IPrivateNavigation>(
  'APP_PRIVATE_NAVIGATION'
);

// ============================================================================
// EXPORTS
// ============================================================================

export {
  IDeployedResources,
  IUploadedResources,
  IApiEndpoints,
  IPublicNavigation,
  IPrivateNavigation
};
