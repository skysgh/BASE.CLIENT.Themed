import { SystemSourcesImages } from "./systemSourcesImages";

/**
 * Contract to define
 * the relative urls where
 * to retrieve assets, images, etc.
 * I called it Sources instead of Assets
 * in case I need to add service urls
 */
export interface SystemSources {
  /**
   * The root directory for assets
   */
  root: string;
  /**
   * The directory for assets:
   */
  assets: SystemAssets;
}
/**
 * Contract to define
 * the relative urls where
 * to retrieve assets, images, etc.
 */
export interface SystemAssets {

  /**
   * Root directory for assets (i18n, images, etc.)
   */
  root: string;
  /**
   * Where to find app
   * internationalisation data.
   */
  i18n: string;
  /**
   * Where to retrieve imaegs from.
   */
  images: SystemSourcesImages;

  /**
   * Where to retrieve imaegs from.
   */
  markdown: string;
}
