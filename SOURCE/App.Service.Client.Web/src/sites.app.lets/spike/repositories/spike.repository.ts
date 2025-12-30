import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SpikeDto } from '../models/dtos/spike.dto';
import { appletsSpikesConstants } from '../constants/implementations/app.lets.spikes.constants';

/**
 * Spike Repository
 * 
 * Handles HTTP communication with Spike API endpoints.
 * Part of the repository pattern: Repository → Mapper → Service → Component
 * 
 * Responsibilities:
 * - Execute HTTP requests (GET, POST, PUT, DELETE)
 * - Return raw DTOs (no mapping here - that's the mapper's job)
 * - Handle API-specific concerns (endpoints, query params)
 * 
 * Architecture:
 * - providedIn: 'root' (singleton)
 * - Returns Observables of DTOs
 * - Consumed by mappers (not directly by components)
 * - Stateless (no caching, no signals - that's the service layer)
 * - API URL comes from constants (never hardcoded)
 */
@Injectable({ providedIn: 'root' })
export class SpikeRepository {
  private readonly apiUrl: string;

  constructor(private http: HttpClient) {
    // API URL from constants (proxied in dev, direct in prod)
    this.apiUrl = appletsSpikesConstants.apis.spike;
  }

  /**
   * Get all spikes
   * 
   * @returns Observable<SpikeDto[]> Array of spike DTOs
   */
  getAll(): Observable<SpikeDto[]> {
    return this.http.get<SpikeDto[]>(this.apiUrl);
  }

  /**
   * Get spike by ID
   * 
   * @param id Spike ID (UUID)
   * @returns Observable<SpikeDto> Single spike DTO
   */
  getById(id: string): Observable<SpikeDto> {
    return this.http.get<SpikeDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new spike
   * 
   * @param dto Spike data to create
   * @returns Observable<SpikeDto> Created spike DTO
   */
  create(dto: SpikeDto): Observable<SpikeDto> {
    return this.http.post<SpikeDto>(this.apiUrl, dto);
  }

  /**
   * Update existing spike
   * 
   * @param id Spike ID to update
   * @param dto Updated spike data
   * @returns Observable<SpikeDto> Updated spike DTO
   */
  update(id: string, dto: SpikeDto): Observable<SpikeDto> {
    return this.http.put<SpikeDto>(`${this.apiUrl}/${id}`, dto);
  }

  /**
   * Delete spike
   * 
   * @param id Spike ID to delete
   * @returns Observable<void>
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
