/**
 * Service Feature View Model
 * 
 * UI-friendly representation of a service feature.
 * Optimized for template consumption and presentation logic.
 * 
 * **Purpose:**
 * - UI-friendly naming (isEnabled vs enabled)
 * - Computed/derived fields (imageUrl from imageId)
 * - Simplified structure for components
 * 
 * **Differences from DTO:**
 * - `enabled` → `isEnabled` (clearer in templates)
 * - `imageId` → `imageUrl` (ready-to-use URL)
 * - May include additional computed fields
 * 
 * **Usage:**
 * ```typescript
 * // In component template
 * <div *ngFor="let feature of features()">
 *   <h3>{{ feature.title }}</h3>
 *   <p>{{ feature.description }}</p>
 *   <img [src]="feature.imageUrl" *ngIf="feature.isEnabled" />
 * </div>
 * ```
 * 
 * **Mapping:**
 * Converted from ServiceFeatureDto via mapper functions.
 */
export interface ServiceFeatureViewModel {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Parent service identifier
   */
  serviceId: string;

  /**
   * Whether feature is enabled
   * (UI-friendly naming)
   */
  isEnabled: boolean;

  /**
   * Feature title
   * May contain i18n keys that need translation
   */
  title: string;

  /**
   * Feature description
   * May contain i18n keys that need translation
   */
  description: string;

  /**
   * Complete URL to feature image
   * Computed from imageId in mapper
   * 
   * Example: "/assets/features/analytics.svg"
   */
  imageUrl: string;

  /**
   * Optional CSS class for styling
   * Can be added by mapper based on feature type
   */
  cssClass?: string;
}
