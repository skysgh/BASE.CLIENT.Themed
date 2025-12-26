/**
 * Uploaded Resource Path Contracts
 * 
 * Defines interfaces for USER-GENERATED resources uploaded at runtime.
 * 
 * RESOURCE CLASSIFICATION:
 * ========================
 * 
 * UPLOADED RESOURCES (This file):
 * - User-generated content created at runtime
 * - HIGH RISK - requires authentication & authorization
 * - May need signed URLs with time-limited access
 * - Requires virus/malware scanning
 * - Should be on separate domain (XSS protection)
 * - Examples: profile photos, attachments, user documents
 * 
 * vs.
 * 
 * DEPLOYED RESOURCES (See: deployed-resource.contracts.ts):
 * - Static assets bundled with deployment
 * - Safe, public, CDN-friendly
 * - No authentication required
 * - Examples: logos, flags, backgrounds
 * 
 * ARCHITECTURE:
 * - Sites tier defines contracts (what it needs)
 * - Apps.Main provides implementation (concrete base URLs)
 * - ResourceUrlService generates signed URLs when needed
 * - Sites components consume via DI (injection)
 * 
 * SECURITY CONSIDERATIONS:
 * ⚠️ UPLOADED RESOURCES ARE HIGH RISK:
 * - Must validate/sanitize ALL uploads
 * - Must scan for viruses/malware
 * - Must check file types/extensions
 * - Must enforce size limits
 * - Should use signed URLs (time-limited access)
 * - Should serve from different domain (prevents XSS attacks)
 * - Must implement access control (who can view?)
 * 
 * SIGNED URL PATTERN (Future implementation):
 * ```typescript
 * // Backend generates signed URL:
 * GET /api/resources/sign?path=/users/profiles/123.jpg&expiry=60
 * Returns: { signedUrl: "https://uploads.example.com/users/profiles/123.jpg?sig=abc&exp=123" }
 * 
 * // Component requests signed URL:
 * getUserPhoto(userId: string): Observable<string> {
 *   const path = this.uploaded.users.profiles + userId + '.jpg';
 *   return this.resourceUrlService.getSignedUrl(path, 60); // 60 min expiry
 * }
 * ```
 * 
 * USAGE:
 * ```typescript
 * // In component:
 * import { UploadedResourcePaths } from '../../contracts';
 * import { UPLOADED_RESOURCES } from '../../tokens';
 * 
 * constructor(
 *   @Inject(UPLOADED_RESOURCES) private uploaded: UploadedResourcePaths,
 *   private resourceUrlService: ResourceUrlService
 * ) {}
 * 
 * // Get signed URL for user photo:
 * getUserPhotoUrl(userId: string): Observable<string> {
 *   return this.resourceUrlService.getSignedUrl(
 *     this.uploaded.users.profiles + userId + '.jpg'
 *   );
 * }
 * 
 * // In template (with async pipe):
 * <img [src]="getUserPhotoUrl(user.id) | async" alt="User Photo">
 * ```
 * 
 * @see deployed-resource.contracts.ts for static resources
 * @see _custom/documentation/patterns/resource-injection-pattern.md
 */

/**
 * Uploaded (user-generated) resource paths.
 * 
 * ⚠️ SECURITY WARNING:
 * All paths in this interface represent HIGH-RISK resources that:
 * - Are created by end users at runtime
 * - MUST be validated and scanned for malware
 * - MUST require authentication to access
 * - SHOULD use signed URLs with expiration
 * - SHOULD be served from a separate domain
 */
export interface UploadedResourcePaths {
  /**
   * User profile and identity resources
   * 
   * USAGE: Profile photos, avatars, identity verification
   * SECURITY: Auth required, signed URLs recommended
   * RISK: HIGH (user-uploaded images can contain malicious content)
   * VALIDATION: File type, size, virus scan
   */
  users: {
    /** Root user uploads directory */
    root: string;
    /** User profile photos */
    profiles: string;
    /** User avatar images (smaller, for lists/comments) */
    avatars: string;
  };
  
  /**
   * Document and attachment resources
   * 
   * USAGE: Email attachments, uploaded documents, file sharing
   * SECURITY: Auth required, signed URLs highly recommended
   * RISK: VERY HIGH (documents can contain malware, macros, scripts)
   * VALIDATION: File type whitelist, size limits, virus scan, sandboxing
   */
  documents: {
    /** Root documents directory */
    root: string;
    /** Email/message attachments */
    attachments: string;
    /** General file uploads */
    uploads: string;
  };
  
  /**
   * Media resources (photos, videos)
   * 
   * USAGE: User-shared photos, videos, galleries
   * SECURITY: Auth required, signed URLs recommended
   * RISK: HIGH (media files can contain exploits, inappropriate content)
   * VALIDATION: File type, size, virus scan, content moderation
   */
  media: {
    /** Root media directory */
    root: string;
    /** User-uploaded photos */
    photos: string;
    /** User-uploaded videos */
    videos: string;
  };
}

/**
 * Configuration for resource upload limits and validation.
 * 
 * This interface defines the constraints and rules for uploaded resources.
 * Provide this alongside UPLOADED_RESOURCES to enforce security policies.
 * 
 * USAGE:
 * ```typescript
 * export const UPLOAD_CONFIG = new InjectionToken<UploadConfiguration>('upload.config');
 * 
 * // In provider:
 * { provide: UPLOAD_CONFIG, useValue: { maxFileSize: 10 * 1024 * 1024 } }
 * ```
 */
export interface UploadConfiguration {
  /** Maximum file size in bytes (default: 10MB) */
  maxFileSize: number;
  /** Allowed MIME types (whitelist) */
  allowedMimeTypes: string[];
  /** Allowed file extensions (whitelist) */
  allowedExtensions: string[];
  /** Whether to require virus scanning */
  requireVirusScan: boolean;
  /** Signed URL expiration time in minutes */
  signedUrlExpiryMinutes: number;
  /** Upload domain (should be different from app domain) */
  uploadDomain: string;
}
