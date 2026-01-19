/**
 * Media Repository
 * 
 * HTTP communication with Media API endpoints.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mediaConstants } from '../constants';
import { MediaFileDto } from '../models/dtos';

@Injectable({ providedIn: 'root' })
export class MediaRepository {
  private readonly apiUrl = mediaConstants.apis.files;

  constructor(private http: HttpClient) {}

  /**
   * Get all media files
   */
  getAll(): Observable<MediaFileDto[]> {
    return this.http.get<MediaFileDto[]>(this.apiUrl);
  }

  /**
   * Get media file by ID
   */
  getById(id: string): Observable<MediaFileDto> {
    return this.http.get<MediaFileDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get media files by user ID
   */
  getByUserId(userId: string): Observable<MediaFileDto[]> {
    return this.http.get<MediaFileDto[]>(`${this.apiUrl}?uploadedByUserId=${userId}`);
  }

  /**
   * Get media files by tag
   */
  getByTag(tag: string): Observable<MediaFileDto[]> {
    return this.http.get<MediaFileDto[]>(`${this.apiUrl}?tags_like=${tag}`);
  }

  /**
   * Create media file record (after upload)
   * Note: Actual file upload would go to a different endpoint (blob storage)
   */
  create(dto: MediaFileDto): Observable<MediaFileDto> {
    return this.http.post<MediaFileDto>(this.apiUrl, dto);
  }

  /**
   * Update media file metadata
   */
  update(id: string, dto: Partial<MediaFileDto>): Observable<MediaFileDto> {
    return this.http.patch<MediaFileDto>(`${this.apiUrl}/${id}`, dto);
  }

  /**
   * Soft delete media file
   */
  softDelete(id: string): Observable<MediaFileDto> {
    return this.http.patch<MediaFileDto>(`${this.apiUrl}/${id}`, {
      isDeleted: true,
      deletedUtc: new Date().toISOString(),
    });
  }

  /**
   * Hard delete media file
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Upload file with progress tracking
   * Note: This would typically go to a dedicated upload endpoint
   */
  uploadWithProgress(file: File, metadata?: { description?: string; tags?: string[] }): Observable<HttpEvent<MediaFileDto>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (metadata?.description) {
      formData.append('description', metadata.description);
    }
    if (metadata?.tags) {
      formData.append('tags', JSON.stringify(metadata.tags));
    }

    const req = new HttpRequest('POST', `${this.apiUrl}/upload`, formData, {
      reportProgress: true,
    });

    return this.http.request<MediaFileDto>(req);
  }
}
