/**
 * Uploaded Resource Injection Token
 * 
 * Provides Angular DI token for USER-GENERATED/UPLOADED resources.
 * 
 * RESOURCE TYPE: Uploaded (Dynamic, Auth-Required, High-Risk)
 * - Created by users at runtime
 * - Requires authentication/authorization
 * - Should use signed URLs (time-limited access)
 * - Needs virus scanning and validation
 * - Examples: profile photos, attachments, user documents
 * 
 * ⚠️ SECURITY WARNING:
 * Components consuming this token MUST implement proper security:
 * - Validate user permissions before displaying resources
 * - Use signed URLs with expiration (via ResourceUrlService)
 * - Never trust user-uploaded content
 * - Implement content security policies
 * 
 * ARCHITECTURE:
 * - Token defined in Sites (consumer defines contract)
 * - Base URLs provided in Apps.Main (provider implements contract)
 * - ResourceUrlService generates signed URLs (future implementation)
 * - Components inject token + service (loose coupling via DI)
 * 
 * TIER PLACEMENT:
 * Sites tier is correct because:
 * 1. Sites components consume resources (consumer ownership)
 * 2. Avoids CLI-managed apps/ directory (safer from overwrites)
 * 3. Enables Sites library extraction (self-contained contracts)
 * 4. Follows SOLID: consumer defines interface, provider implements
 * 
 * PROVIDER SETUP:
 * ```typescript
 * // apps.main/module.ts
 * import { UPLOADED_RESOURCES } from '../sites/tokens';
 * import { environment } from '../environments/environment';
 * 
 * @NgModule({
 *   providers: [{
 *     provide: UPLOADED_RESOURCES,
 *     useValue: {
 *       users: { 
 *         root: environment.uploadsBaseUrl + '/users/',
 *         profiles: environment.uploadsBaseUrl + '/users/profiles/',
 *         avatars: environment.uploadsBaseUrl + '/users/avatars/'
 *       },
 *       documents: { ... },
 *       media: { ... }
 *     }
 *   }]
 * })
 * ```
 * 
 * CONSUMER USAGE (Current - Direct URLs):
 * ```typescript
 * // sites/components/team/component.ts
 * import { UPLOADED_RESOURCES, UploadedResourcePaths } from '../../tokens';
 * 
 * export class TeamComponent {
 *   constructor(
 *     @Inject(UPLOADED_RESOURCES) public uploaded: UploadedResourcePaths
 *   ) {}
 *   
 *   getUserPhotoUrl(userId: string): string {
 *     // ⚠️ Basic implementation - no signing yet
 *     return this.uploaded.users.profiles + userId + '.jpg';
 *   }
 * }
 * ```
 * 
 * CONSUMER USAGE (Future - Signed URLs):
 * ```typescript
 * // sites/components/team/component.ts
 * import { UPLOADED_RESOURCES, UploadedResourcePaths } from '../../tokens';
 * import { ResourceUrlService } from '../../../core/services/resource-url.service';
 * 
 * export class TeamComponent {
 *   constructor(
 *     @Inject(UPLOADED_RESOURCES) private uploaded: UploadedResourcePaths,
 *     private resourceUrlService: ResourceUrlService
 *   ) {}
 *   
 *   getUserPhotoUrl(userId: string): Observable<string> {
 *     const path = this.uploaded.users.profiles + userId + '.jpg';
 *     return this.resourceUrlService.getSignedUrl(path, 60); // 60 min expiry
 *   }
 * }
 * ```
 * 
 * TEMPLATE USAGE (with Async Pipe for Signed URLs):
 * ```html
 * <!-- Requires authentication, uses signed URL -->
 * <img [src]="getUserPhotoUrl(user.id) | async" alt="User Photo">
 * ```
 * 
 * @see uploaded-resource.contracts.ts for interface definition
 * @see deployed-resource.tokens.ts for static content
 * @see _custom/documentation/patterns/resource-injection-pattern.md
 */

import { InjectionToken } from '@angular/core';
import { UploadedResourcePaths, UploadConfiguration } from '../contracts';

/**
 * Injection token for uploaded (user-generated) resource paths.
 * 
 * Defined by Sites tier, provided by Apps.Main, consumed by Sites components.
 * 
 * ⚠️ SECURITY: HIGH RISK
 * - User-generated content (untrusted)
 * - Requires authentication to access
 * - Should use signed URLs with expiration
 * - Must implement virus scanning
 * - Should be served from separate domain
 */
export const UPLOADED_RESOURCES = new InjectionToken<UploadedResourcePaths>(
  'uploaded.resources'
  // Note: No providedIn - must be provided explicitly in Apps.Main module
);

/**
 * Injection token for upload configuration and security policies.
 * 
 * Defines validation rules, size limits, and security constraints
 * for user-uploaded resources.
 * 
 * USAGE:
 * ```typescript
 * // apps.main/module.ts
 * {
 *   provide: UPLOAD_CONFIG,
 *   useValue: {
 *     maxFileSize: 10 * 1024 * 1024, // 10MB
 *     allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
 *     allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif'],
 *     requireVirusScan: true,
 *     signedUrlExpiryMinutes: 60,
 *     uploadDomain: 'https://uploads.example.com'
 *   }
 * }
 * ```
 */
export const UPLOAD_CONFIG = new InjectionToken<UploadConfiguration>(
  'upload.config'
  // Note: No providedIn - must be provided explicitly in Apps.Main module
);
