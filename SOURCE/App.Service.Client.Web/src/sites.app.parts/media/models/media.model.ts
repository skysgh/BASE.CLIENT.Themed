/**
 * Media Domain Models
 * 
 * Core entities for the Media domain:
 * - MediaFile: Uploaded file with metadata (Aggregate Root)
 * - MalwareScanResult: Scan status and result (Value Object)
 */

// ═══════════════════════════════════════════════════════════════════
// Malware Scan Result (Value Object)
// ═══════════════════════════════════════════════════════════════════

/**
 * MalwareScanResult - Value Object embedded in MediaFile
 * 
 * This is a VALUE OBJECT because:
 * - No identity of its own (no separate ID)
 * - Immutable - a new scan creates a new result object
 * - Part of MediaFile's lifecycle
 * - Describes the MediaFile, not independent of it
 */
export interface MalwareScanResult {
  /** Scan status */
  status: MalwareScanStatus;
  
  /** When the scan was performed */
  scannedUtc: Date | null;
  
  /** Scanning engine used (e.g., "ClamAV", "Windows Defender") */
  engine: string | null;
  
  /** Name of detected threat (if infected) */
  threatName: string | null;
  
  /** Error message (if scan failed) */
  errorMessage: string | null;
}

export type MalwareScanStatus = 
  | 'pending'     // Not yet scanned
  | 'scanning'    // Currently being scanned
  | 'clean'       // No threats detected
  | 'infected'    // Threat detected
  | 'error';      // Scan failed

/**
 * Create a default pending scan result
 */
export function createPendingScanResult(): MalwareScanResult {
  return {
    status: 'pending',
    scannedUtc: null,
    engine: null,
    threatName: null,
    errorMessage: null,
  };
}

// ═══════════════════════════════════════════════════════════════════
// Media File (Aggregate Root)
// ═══════════════════════════════════════════════════════════════════

/**
 * MediaFile - Aggregate Root for uploaded files
 * 
 * Contains file metadata and an embedded MalwareScanResult value object.
 * Other entities reference MediaFile by ID (e.g., Person.avatarMediaId).
 */
export interface MediaFile {
  id: string;
  
  // File identification
  /** Stored filename (may be sanitized/hashed) */
  filename: string;
  
  /** Original filename as uploaded by user */
  originalFilename: string;
  
  /** File extension (derived from filename) */
  extension: string;
  
  // File properties
  /** MIME type (e.g., "image/jpeg", "application/pdf") */
  mimeType: string;
  
  /** File size in bytes */
  sizeBytes: number;
  
  /** Human-readable file size */
  sizeFormatted?: string;
  
  // Storage
  /** URL/path to the stored file */
  storageUrl: string;
  
  /** Storage provider (e.g., "local", "azure-blob", "s3") */
  storageProvider?: string;
  
  // Upload context
  /** When the file was uploaded */
  uploadedUtc: Date;
  
  /** User who uploaded the file */
  uploadedByUserId: string;
  
  /** Optional description */
  description?: string;
  
  /** Tags for categorization */
  tags?: string[];
  
  // Security - Value Object (1-1 relationship)
  /** Malware scan result */
  malwareScan: MalwareScanResult;
  
  // Metadata
  createdUtc?: Date;
  modifiedUtc?: Date;
  isDeleted?: boolean;
  deletedUtc?: Date;
}

// ═══════════════════════════════════════════════════════════════════
// Media File Category
// ═══════════════════════════════════════════════════════════════════

/**
 * Categorize a file based on its MIME type
 */
export type MediaCategory = 
  | 'image'
  | 'document'
  | 'spreadsheet'
  | 'presentation'
  | 'archive'
  | 'audio'
  | 'video'
  | 'other';

/**
 * Get media category from MIME type
 */
export function getMediaCategory(mimeType: string): MediaCategory {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('video/')) return 'video';
  
  if (mimeType === 'application/pdf' || 
      mimeType.includes('word') || 
      mimeType.includes('document')) {
    return 'document';
  }
  
  if (mimeType.includes('sheet') || mimeType.includes('excel')) {
    return 'spreadsheet';
  }
  
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
    return 'presentation';
  }
  
  if (mimeType.includes('zip') || 
      mimeType.includes('tar') || 
      mimeType.includes('compressed')) {
    return 'archive';
  }
  
  return 'other';
}

/**
 * Get icon for media category
 */
export function getMediaCategoryIcon(category: MediaCategory): string {
  const icons: Record<MediaCategory, string> = {
    image: 'ri-image-line',
    document: 'ri-file-text-line',
    spreadsheet: 'ri-file-excel-line',
    presentation: 'ri-file-ppt-line',
    archive: 'ri-file-zip-line',
    audio: 'ri-music-line',
    video: 'ri-video-line',
    other: 'ri-file-line',
  };
  return icons[category];
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
