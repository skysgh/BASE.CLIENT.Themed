/**
 * Media Domain Constants
 */

export const mediaConstants = {
  id: 'Media',
  
  apis: {
    /** Media files collection endpoint */
    files: '/api/rest/media_Files',
  },
  
  /** Maximum file size in bytes (50MB) */
  maxFileSizeBytes: 50 * 1024 * 1024,
  
  /** Allowed MIME types */
  allowedMimeTypes: {
    images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    documents: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
    archives: ['application/zip', 'application/x-tar', 'application/gzip'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
    video: ['video/mp4', 'video/webm', 'video/quicktime'],
  },
  
  /** All allowed MIME types combined */
  get allAllowedMimeTypes(): string[] {
    return [
      ...this.allowedMimeTypes.images,
      ...this.allowedMimeTypes.documents,
      ...this.allowedMimeTypes.archives,
      ...this.allowedMimeTypes.audio,
      ...this.allowedMimeTypes.video,
    ];
  },
};
