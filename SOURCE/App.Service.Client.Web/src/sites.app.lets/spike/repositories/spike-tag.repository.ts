import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { 
  SpikeTagDto, 
  mapSpikeTagDtoToViewModel, 
  SpikeTagViewModel,
  DEFAULT_SPIKE_TAGS 
} from '../domain/reference-data/spike-tag.model';

/**
 * Spike Tag Repository
 * 
 * Manages Spike tags (user-defined labels).
 */
@Injectable({ providedIn: 'root' })
export class SpikeTagRepository {
  private readonly baseUrl = 'http://localhost:3000/app_spike_Tags';

  constructor(private http: HttpClient) {}

  /**
   * Get all tags
   */
  getAll(): Observable<SpikeTagViewModel[]> {
    return this.http.get<SpikeTagDto[]>(this.baseUrl).pipe(
      map(dtos => dtos.map(mapSpikeTagDtoToViewModel)),
      catchError(() => of(DEFAULT_SPIKE_TAGS.map(mapSpikeTagDtoToViewModel)))
    );
  }

  /**
   * Get tag by ID
   */
  getById(id: string): Observable<SpikeTagViewModel | undefined> {
    return this.http.get<SpikeTagDto>(`${this.baseUrl}/${id}`).pipe(
      map(dto => mapSpikeTagDtoToViewModel(dto)),
      catchError(() => of(undefined))
    );
  }

  /**
   * Create a new tag
   */
  create(tag: Omit<SpikeTagDto, 'id'>): Observable<SpikeTagDto> {
    const newTag: SpikeTagDto = {
      ...tag,
      id: `tag-${Date.now()}`,
      isSystem: false
    };
    return this.http.post<SpikeTagDto>(this.baseUrl, newTag);
  }

  /**
   * Delete a tag (only non-system tags)
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
