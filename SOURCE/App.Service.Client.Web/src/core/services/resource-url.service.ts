// Rx:
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
// Ag:
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Environment:
import { environment } from '../../environments/environment';

/**
 * Resource URL Service
 * 
 * Provides URLs for accessing resources (images, documents, media).
 * 
 * ARCHITECTURE:
 * - Development Mode: Returns direct paths to theme/mock assets
 * - Production Mode: Returns signed URLs from API (future)
 * 
 * SECURITY PATTERN:
 * All resource access (even "public" avatars) goes through this service.
 * 
 * Why Signatures for Public Resources?
 * 1. **Employee Departure**: Expire key → instant cleanup
 * 2. **GDPR Compliance**: Right to be forgotten → immediate revocation
 * 3. **Cost Control**: Prevent hotlinking/bandwidth theft
 * 4. **Audit Trail**: Track access for legal compliance
 * 5. **Consistency**: Same pattern everywhere (simpler code)
 * 
 * PHASES:
 * - Phase 1 (NOW): Direct paths to theme assets (dev mode)
 * - Phase 2 (NEXT): Add caching, path normalization
 * - Phase 3 (PRODUCTION): Signed URLs via API + blob storage
 * 
 * Usage:
 * ```typescript
 * constructor(private resourceUrlService: ResourceUrlService) {}
 * 
 * getUserAvatar(imageName: string): Observable<string> {
 *   return this.resourceUrlService.getUserAvatarUrl(imageName);
 * }
 * ```
 * 
 * Template:
 * ```html
 * <img [src]="getUserAvatar(user.imageName) | async" alt="">
 * ```
 * 
 * @see _custom/documentation/architecture/resource-signatures-strategy.md
 */
@Injectable({ providedIn: 'root' })
export class ResourceUrlService {
  
  constructor(private http: HttpClient) {}
  
  /**
   * Get URL for user avatar/profile photo
   * 
   * Development Mode: Returns direct path (tier-agnostic)
   * Production Mode: Returns signed URL from blob storage
   * 
   * Path Structure:
   * - Dev: /assets/media/sensitive/images/users/{filename}
   * - Prod: https://cdn.blob.core.windows.net/media/sensitive/images/users/{filename}?sig=...
   * 
   * Note: In dev, path doesn't include tier (sites.anon) because:
   * - Matches production blob structure (no tier in blob paths)
   * - Angular serves from sites.anon/assets/media → /assets/media
   * - Simpler migration to blob storage (same path structure)
   * 
   * @param imageName - Filename (e.g., "avatar-2.jpg")
   * @returns Observable<string> - Full URL to avatar image
   * 
   * Example:
   * ```typescript
   * this.resourceUrlService.getUserAvatarUrl('avatar-2.jpg')
   *   .subscribe(url => console.log(url));
   * // Dev: "/assets/media/sensitive/images/users/avatar-2.jpg"
   * // Prod: "https://cdn.blob.core.windows.net/media/sensitive/images/users/avatar-2.jpg?sig=abc&exp=123"
   * ```
   */
  getUserAvatarUrl(imageName: string): Observable<string> {
    // ✅ PHASE 1: Development mode - direct path (tier-agnostic, matches prod structure)
    if (!environment.production) {
      return of(`/assets/media/sensitive/images/users/${imageName}`);
    }
    
    // ✅ PHASE 3: Production mode - signed URL from blob storage
    // Structure: https://storage.blob.core.windows.net/media/sensitive/images/users/{filename}?sig=abc&exp=123
    return this.getSignedUrl(`media/sensitive/images/users/${imageName}`, 60, 'user_avatar');
  }
  
  /**
   * Get URL for user-uploaded document
   * 
   * Always requires authentication and signed URL (HIGH RISK content)
   * 
   * Path Structure (same as avatars):
   * - Dev: /assets/media/sensitive/documents/{filename}
   * - Prod: https://cdn.blob.core.windows.net/media/sensitive/documents/{filename}?sig=...
   * 
   * @param userId - User ID who owns the document
   * @param filename - Document filename
   * @returns Observable<string> - Signed URL with expiration
   */
  getUserDocumentUrl(userId: string, filename: string): Observable<string> {
    // ✅ PHASE 1: Development mode - direct path (tier-agnostic)
    if (!environment.production) {
      return of(`/assets/media/sensitive/documents/${filename}`);
    }
    
    // ✅ PHASE 3: Production mode - signed URL (requires auth)
    // Note: In prod, user ID might be part of blob path for isolation
    return this.getSignedUrl(`media/sensitive/documents/${userId}/${filename}`, 60, 'user_document');
  }
  
  /**
   * Get URL for team member photo (public marketing site)
   * 
   * Development Mode: Returns direct path (tier-agnostic)
   * Production Mode: Returns signed URL (even for "public" images)
   * 
   * Path Structure:
   * - Dev: /assets/media/sensitive/images/users/{filename}  (same as user avatars!)
   * - Prod: https://cdn.blob.core.windows.net/media/sensitive/images/users/{filename}?sig=...
   * 
   * Why "sensitive" for public team photos?
   * - Enables signature-based access control (employee cleanup, GDPR)
   * - Same structure as user avatars (consistency)
   * - Signature validates access (even if image is "public")
   * 
   * Why signatures for public images?
   * - Employee departure cleanup (expire key → instant cleanup)
   * - GDPR compliance (revoke access immediately)
   * - Cost control (prevent hotlinking)
   * - Audit trail (track access)
   * 
   * @param imageName - Team member photo filename
   * @returns Observable<string> - URL to team photo
   */
  getTeamMemberPhotoUrl(imageName: string): Observable<string> {
    // ✅ PHASE 1: Development mode - use tier-agnostic path
    if (!environment.production) {
      return of(`/assets/media/sensitive/images/users/${imageName}`);
    }
    
    // ✅ PHASE 3: Production mode - signed URL (public but tracked)
    // Note: Could use /media/open/ for truly public images, but using /sensitive/
    // enables signature-based cleanup when employee leaves
    return this.getSignedUrl(`media/sensitive/images/users/${imageName}`, 60, 'team_member_photo');
  }
  
  /**
   * Get signed URL from API (PHASE 3 - Future Implementation)
   * 
   * This method will call the backend API to generate a time-limited
   * signed URL for accessing blob storage.
   * 
   * Benefits:
   * - Access revocation (expire signature key)
   * - Bandwidth control (prevent hotlinking)
   * - Audit trail (log access)
   * - Cost management (track usage)
   * 
   * @param path - Resource path in blob storage
   * @param expiryMinutes - How long the URL is valid
   * @param reason - Why this resource is being accessed (for audit)
   * @returns Observable<string> - Signed URL with expiration
   * 
   * @throws Error - Not implemented yet (Phase 3)
   * 
   * Example API Response:
   * ```json
   * {
   *   "url": "https://cdn.example.com/path?sig=abc&exp=123",
   *   "expiresAt": "2024-01-01T12:00:00Z"
   * }
   * ```
   */
  private getSignedUrl(
    path: string, 
    expiryMinutes: number, 
    reason: string
  ): Observable<string> {
    // ✅ PHASE 3: Implement when API ready
    // TODO: Replace this with actual API call
    /*
    return this.http.post<{url: string, expiresAt: string}>(
      '/api/resources/sign',
      { 
        path, 
        expiryMinutes, 
        reason  // For audit trail
      }
    ).pipe(
      map(response => response.url)
    );
    */
    
    // ⚠️ PHASE 1: Not implemented yet
    throw new Error(
      `Signed URLs not implemented yet (Phase 3). ` +
      `Requested: ${path} for ${reason}`
    );
  }
  
  /**
   * Get URL for static deployed asset (logos, flags, backgrounds)
   * 
   * These are bundled with the app, safe for direct access.
   * No signatures needed (reviewed by team, version-controlled).
   * 
   * @param assetPath - Path relative to /assets/deployed/
   * @returns string - Direct URL (not Observable - always available)
   */
  getDeployedAssetUrl(assetPath: string): string {
    return `/assets/deployed/${assetPath}`;
  }
  
  /**
   * Check if resource URL service is in production mode
   * 
   * Useful for components to know if they should expect
   * signed URLs (production) or direct paths (development).
   * 
   * @returns boolean - True if production mode
   */
  isProductionMode(): boolean {
    return environment.production;
  }
}
