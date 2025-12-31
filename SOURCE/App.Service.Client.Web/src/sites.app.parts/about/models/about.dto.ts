/**
 * About Models
 * 
 * DTOs and interfaces for the About applet.
 */

/**
 * License DTO
 * 
 * Represents an open source license attribution.
 */
export interface LicenseDto {
  /** Package name */
  name: string;
  /** Package version */
  version: string;
  /** License type (MIT, Apache-2.0, etc.) */
  license: string;
  /** License URL */
  licenseUrl?: string;
  /** Repository URL */
  repository?: string;
  /** Author/Maintainer */
  author?: string;
  /** Description */
  description?: string;
}

/**
 * Creator Info DTO
 * 
 * Information about the service creator/developer.
 */
export interface CreatorInfoDto {
  /** Company/Creator name */
  name: string;
  /** Logo URL */
  logo?: string;
  /** Website */
  website?: string;
  /** Description */
  description?: string;
  /** Contact email */
  email?: string;
  /** Copyright notice */
  copyright?: string;
  /** Social links */
  social?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

/**
 * Distributor Info DTO
 * 
 * Information about the service distributor/reseller.
 */
export interface DistributorInfoDto {
  /** Distributor name */
  name: string;
  /** Logo URL */
  logo?: string;
  /** Website */
  website?: string;
  /** Description */
  description?: string;
  /** Contact email */
  email?: string;
  /** Support URL */
  supportUrl?: string;
  /** Partner tier */
  partnerTier?: string;
}

/**
 * Version Info DTO
 */
export interface VersionInfoDto {
  /** Application version */
  version: string;
  /** Build number */
  buildNumber?: string;
  /** Build date */
  buildDate?: string;
  /** Git commit hash */
  commitHash?: string;
  /** Environment (dev/staging/prod) */
  environment?: string;
  /** Angular version */
  angularVersion?: string;
  /** Node version used for build */
  nodeVersion?: string;
}

/**
 * Complete About Info DTO
 */
export interface AboutInfoDto {
  creator: CreatorInfoDto;
  distributor?: DistributorInfoDto;
  version: VersionInfoDto;
  licenses: LicenseDto[];
  theme?: ThemeInfoDto;
}

/**
 * Theme Info DTO
 * 
 * Information about the UI theme used.
 */
export interface ThemeInfoDto {
  /** Theme name */
  name: string;
  /** Theme vendor */
  vendor: {
    name: string;
    marketplace?: string;
  };
  /** Product/Template ID */
  productId?: string;
  /** Style variant (e.g., 'Minimal', 'Default') */
  style?: string;
  /** Layout type (e.g., 'Vertical', 'Horizontal') */
  layout?: string;
  /** Theme version (null if unknown) */
  version: string | null;
  /** Download date (null if unknown) */
  downloadDate: string | null;
  /** Related URLs */
  urls?: {
    themeForest?: string;
    preview?: string;
    demo?: string;
    admin?: string;
  };
  /** License information */
  license?: {
    type?: string;
    holder?: string;
    purchaseCode?: string;
  };
  /** Additional notes */
  notes?: string;
}
