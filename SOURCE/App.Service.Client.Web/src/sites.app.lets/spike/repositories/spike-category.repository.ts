import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { 
  SpikeCategoryDto, 
  mapSpikeCategoryDtoToViewModel, 
  SpikeCategoryViewModel,
  DEFAULT_SPIKE_CATEGORIES 
} from '../domain/reference-data/spike-category.model';

/**
 * Spike Category Repository
 * 
 * Manages Spike categories reference data.
 */
@Injectable({ providedIn: 'root' })
export class SpikeCategoryRepository {
  private readonly baseUrl = 'http://localhost:3000/app_spike_Categories';

  constructor(private http: HttpClient) {}

  /**
   * Get all categories
   */
  getAll(): Observable<SpikeCategoryViewModel[]> {
    return this.http.get<SpikeCategoryDto[]>(this.baseUrl).pipe(
      map(dtos => dtos.map(mapSpikeCategoryDtoToViewModel)),
      catchError(() => of(DEFAULT_SPIKE_CATEGORIES.map(mapSpikeCategoryDtoToViewModel)))
    );
  }

  /**
   * Get category by ID
   */
  getById(id: string): Observable<SpikeCategoryViewModel | undefined> {
    return this.http.get<SpikeCategoryDto>(`${this.baseUrl}/${id}`).pipe(
      map(dto => mapSpikeCategoryDtoToViewModel(dto)),
      catchError(() => of(undefined))
    );
  }
}
