/**
 * Media Service
 * 
 * Signal-based service for MediaFile management.
 * Architecture: Repository (HTTP) → Service (signals) → Component
 */
import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { MediaRepository } from '../repositories';
import { MediaFile, MalwareScanResult, createPendingScanResult, formatFileSize } from '../models';
import { MediaFileDto, MalwareScanResultDto } from '../models/dtos';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class MediaService {
  private repository = inject(MediaRepository);
  private logger = inject(SystemDiagnosticsTraceService);
  
  // Signals
  private _files = signal<MediaFile[]>([]);
  private _loading = signal(false);
  private _uploading = signal(false);
  private _uploadProgress = signal(0);
  private _error = signal<string | null>(null);
  
  // Public readonly
  readonly files = this._files.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly uploading = this._uploading.asReadonly();
  readonly uploadProgress = this._uploadProgress.asReadonly();
  readonly error = this._error.asReadonly();
  
  // Computed
  readonly fileCount = computed(() => this._files().length);
  readonly totalSizeBytes = computed(() => 
    this._files().reduce((acc, f) => acc + f.sizeBytes, 0)
  );
  readonly totalSizeFormatted = computed(() => 
    formatFileSize(this.totalSizeBytes())
  );
  
  constructor() {
    this.logger.debug('MediaService initialized');
  }
  
  // ─────────────────────────────────────────────────────────────────
  // CRUD Operations
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Load all media files from API
   */
  loadFiles(): void {
    this._loading.set(true);
    this._error.set(null);
    
    this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const files = dtos.map(dto => this.mapDtoToMediaFile(dto));
          this._files.set(files);
          this._loading.set(false);
          this.logger.debug(`Loaded ${files.length} media files from API`);
        },
        error: (err) => {
          this._error.set('Failed to load media files');
          this._loading.set(false);
          this.logger.error(`Error loading media files: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }
  
  /**
   * Get media file by ID
   */
  getById(id: string): Observable<MediaFile | undefined> {
    // Check cache first
    const cached = this._files().find(f => f.id === id);
    if (cached) {
      return of(cached);
    }
    
    return this.repository.getById(id).pipe(
      map(dto => this.mapDtoToMediaFile(dto)),
      catchError(() => of(undefined))
    );
  }
  
  /**
   * Get media files by user
   */
  getByUserId(userId: string): Observable<MediaFile[]> {
    return this.repository.getByUserId(userId).pipe(
      map(dtos => dtos.map(dto => this.mapDtoToMediaFile(dto)))
    );
  }
  
  /**
   * Create a media file record (typically called after upload completes)
   */
  createRecord(data: Partial<MediaFile>): Observable<MediaFile> {
    const now = new Date().toISOString();
    const dto: MediaFileDto = {
      id: `media-${Date.now()}`,
      filename: data.filename || 'unnamed',
      originalFilename: data.originalFilename || data.filename || 'unnamed',
      extension: data.extension || '',
      mimeType: data.mimeType || 'application/octet-stream',
      sizeBytes: data.sizeBytes || 0,
      storageUrl: data.storageUrl || '',
      uploadedUtc: data.uploadedUtc?.toISOString() || now,
      uploadedByUserId: data.uploadedByUserId || 'unknown',
      description: data.description,
      tags: data.tags,
      malwareScan: {
        status: 'pending',
        scannedUtc: null,
        engine: null,
        threatName: null,
        errorMessage: null,
      },
      createdUtc: now,
      modifiedUtc: now,
      isDeleted: false,
    };
    
    return this.repository.create(dto).pipe(
      map(savedDto => this.mapDtoToMediaFile(savedDto)),
      tap({
        next: (created) => {
          this._files.update(files => [...files, created]);
          this.logger.debug(`Created media file record: ${created.filename}`);
        },
        error: (err) => {
          this._error.set('Failed to create media file record');
          this.logger.error(`Error creating media file: ${err?.message || err}`);
        }
      })
    );
  }
  
  /**
   * Update media file metadata
   */
  update(id: string, updates: Partial<MediaFile>): Observable<MediaFile | undefined> {
    const dto: Partial<MediaFileDto> = {};
    
    if (updates.description !== undefined) dto.description = updates.description;
    if (updates.tags !== undefined) dto.tags = updates.tags;
    dto.modifiedUtc = new Date().toISOString();
    
    return this.repository.update(id, dto).pipe(
      map(savedDto => this.mapDtoToMediaFile(savedDto)),
      tap({
        next: (updated) => {
          this._files.update(files => 
            files.map(f => f.id === id ? updated : f)
          );
          this.logger.debug(`Updated media file: ${updated.filename}`);
        },
        error: (err) => {
          this._error.set('Failed to update media file');
          this.logger.error(`Error updating media file: ${err?.message || err}`);
        }
      }),
      catchError(() => of(undefined))
    );
  }
  
  /**
   * Soft delete media file
   */
  softDelete(id: string): Observable<boolean> {
    return this.repository.softDelete(id).pipe(
      map(() => true),
      tap({
        next: () => {
          this._files.update(files => 
            files.map(f => f.id === id ? { ...f, isDeleted: true } : f)
          );
          this.logger.debug(`Soft deleted media file: ${id}`);
        },
        error: (err) => {
          this._error.set('Failed to delete media file');
          this.logger.error(`Error deleting media file: ${err?.message || err}`);
        }
      }),
      catchError(() => of(false))
    );
  }
  
  /**
   * Update malware scan result (called by background scan process)
   */
  updateMalwareScan(id: string, scanResult: MalwareScanResult): Observable<MediaFile | undefined> {
    const dto: Partial<MediaFileDto> = {
      malwareScan: {
        status: scanResult.status,
        scannedUtc: scanResult.scannedUtc?.toISOString() || null,
        engine: scanResult.engine,
        threatName: scanResult.threatName,
        errorMessage: scanResult.errorMessage,
      },
      modifiedUtc: new Date().toISOString(),
    };
    
    return this.repository.update(id, dto).pipe(
      map(savedDto => this.mapDtoToMediaFile(savedDto)),
      tap({
        next: (updated) => {
          this._files.update(files => 
            files.map(f => f.id === id ? updated : f)
          );
          this.logger.debug(`Updated malware scan for: ${id}, status: ${scanResult.status}`);
        }
      }),
      catchError(() => of(undefined))
    );
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Mappers
  // ─────────────────────────────────────────────────────────────────
  
  private mapDtoToMediaFile(dto: MediaFileDto): MediaFile {
    return {
      id: dto.id,
      filename: dto.filename,
      originalFilename: dto.originalFilename,
      extension: dto.extension,
      mimeType: dto.mimeType,
      sizeBytes: dto.sizeBytes,
      sizeFormatted: formatFileSize(dto.sizeBytes),
      storageUrl: dto.storageUrl,
      storageProvider: dto.storageProvider,
      uploadedUtc: new Date(dto.uploadedUtc),
      uploadedByUserId: dto.uploadedByUserId,
      description: dto.description,
      tags: dto.tags,
      malwareScan: this.mapScanResultDto(dto.malwareScan),
      createdUtc: dto.createdUtc ? new Date(dto.createdUtc) : undefined,
      modifiedUtc: dto.modifiedUtc ? new Date(dto.modifiedUtc) : undefined,
      isDeleted: dto.isDeleted,
      deletedUtc: dto.deletedUtc ? new Date(dto.deletedUtc) : undefined,
    };
  }
  
  private mapScanResultDto(dto: MalwareScanResultDto | undefined): MalwareScanResult {
    if (!dto) {
      return createPendingScanResult();
    }
    return {
      status: dto.status as any,
      scannedUtc: dto.scannedUtc ? new Date(dto.scannedUtc) : null,
      engine: dto.engine,
      threatName: dto.threatName,
      errorMessage: dto.errorMessage,
    };
  }
}
