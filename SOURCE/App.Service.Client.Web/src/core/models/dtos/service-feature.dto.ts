/**
 * Service Feature Data Transfer Object (DTO)
 * 
 * Represents the server-side contract for service features.
 * Maps 1:1 with API response/request structure.
 * 
 * **Purpose:**
 * - Define exact shape of data from/to API
 * - Server-side naming conventions (enabled vs isEnabled)
 * - Include all fields from database/API
 * 
 * **Usage:**
 * Used by repositories when communicating with backend APIs.
 * Should not be used directly in UI components - use ViewModel instead.
 * 
 * **Example API Response:**
 * ```json
 * {
 *   "id": "abc-123",
 *   "serviceId": "service-xyz",
 *   "enabled": true,
 *   "title": "Advanced Analytics",
 *   "description": "Real-time data analysis and reporting"
 * }
 * ```
 */
export interface ServiceFeatureDto {
  /**
   * Unique identifier (UUID)
   */
  id: string;

  /**
   * Foreign key to parent service
   */
  serviceId: string;

  /**
   * Whether feature is currently enabled
   * (server-side naming convention)
   */
  enabled: boolean;

  /**
   * Feature title (supports i18n keys)
   * Example: "feature.analytics.title" or "Advanced Analytics"
   */
  title: string;

  /**
   * Feature description (supports i18n keys)
   * Example: "feature.analytics.description"
   */
  description: string;

  /**
   * Optional image identifier
   * Used to reference feature icon/image
   */
  imageId?: string;
}
