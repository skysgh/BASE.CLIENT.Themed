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
}
