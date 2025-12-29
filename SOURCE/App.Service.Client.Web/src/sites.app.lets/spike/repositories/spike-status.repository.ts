import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { 
  SpikeStatusDto, 
  mapSpikeStatusDtoToViewModel, 
  SpikeStatusViewModel,
  DEFAULT_SPIKE_STATUSES 
} from '../domain/reference-data/spike-status.model';

/**
 * Spike Status Repository
 * 
 * Manages Spike status reference data.
 */
@Injectable({ providedIn: 'root' })
export class SpikeStatusRepository {
  private readonly baseUrl = 'http://localhost:3000/app_spike_Statuses';

  constructor(private http: HttpClient) {}

  /**
   * Get all statuses
   */
  getAll(): Observable<SpikeStatusViewModel[]> {
    return this.http.get<SpikeStatusDto[]>(this.baseUrl).pipe(
      map(dtos => dtos.map(mapSpikeStatusDtoToViewModel)),
      catchError(() => of(DEFAULT_SPIKE_STATUSES.map(mapSpikeStatusDtoToViewModel)))
    );
  }

  /**
   * Get status by ID
   */
  getById(id: string): Observable<SpikeStatusViewModel | undefined> {
    return this.http.get<SpikeStatusDto>(`${this.baseUrl}/${id}`).pipe(
      map(dto => mapSpikeStatusDtoToViewModel(dto)),
      catchError(() => of(undefined))
    );
  }
}
