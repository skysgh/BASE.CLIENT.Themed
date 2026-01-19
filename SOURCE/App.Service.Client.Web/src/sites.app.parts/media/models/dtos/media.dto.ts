/**
 * Media Domain DTOs
 * 
 * Data Transfer Objects for API communication.
 */

/**
 * MalwareScanResult DTO (embedded in MediaFileDto)
 */
export interface MalwareScanResultDto {
  status: string;
  scannedUtc: string | null;
  engine: string | null;
  threatName: string | null;
  errorMessage: string | null;
}

/**
 * MediaFile DTO - Matches json-server/API shape
 */
export interface MediaFileDto {
  id: string;
  filename: string;
  originalFilename: string;
  extension: string;
  mimeType: string;
  sizeBytes: number;
  storageUrl: string;
  storageProvider?: string;
  uploadedUtc: string;
  uploadedByUserId: string;
  description?: string;
  tags?: string[];
  malwareScan: MalwareScanResultDto;
  createdUtc?: string;
  modifiedUtc?: string;
  isDeleted?: boolean;
  deletedUtc?: string;
}

/**
 * Upload request DTO (when uploading a new file)
 */
export interface MediaUploadRequestDto {
  file: File;
  description?: string;
  tags?: string[];
}

/**
 * Upload response DTO (after successful upload)
 */
export interface MediaUploadResponseDto {
  id: string;
  filename: string;
  storageUrl: string;
  sizeBytes: number;
  mimeType: string;
  uploadedUtc: string;
}
