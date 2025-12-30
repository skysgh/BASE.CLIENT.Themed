import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SubSpikeDto } from '../models/dtos/sub-spike.dto';
import { appletsSpikesConstants } from '../constants/implementations/app.lets.spikes.constants';

/**
 * SubSpike Repository
 * 
 * Handles HTTP communication with SubSpike API endpoints.
 * Part of the repository pattern: Repository → Mapper → Service → Component
 * 
 * Responsibilities:
 * - Execute HTTP requests (GET, POST, PUT, DELETE)
 * - Return raw DTOs (no mapping here - that's the mapper's job)
 * - Handle API-specific concerns (endpoints, query params, filtering)
 * 
 * Architecture:
 * - providedIn: 'root' (singleton)
 * - Returns Observables of DTOs
 * - Consumed by mappers (not directly by components)
 * - Stateless (no caching, no signals - that's the service layer)
 * - API URL comes from constants (never hardcoded)
 */
@Injectable({ providedIn: 'root' })
export class SubSpikeRepository {
  private readonly apiUrl: string;

  constructor(private http: HttpClient) {
    // API URL from constants (proxied in dev, direct in prod)
    this.apiUrl = appletsSpikesConstants.apis.spikes;
  }

  /**
   * Get all sub-spikes
   * 
   * @returns Observable<SubSpikeDto[]> Array of sub-spike DTOs
   */
  getAll(): Observable<SubSpikeDto[]> {
    return this.http.get<SubSpikeDto[]>(this.apiUrl);
  }

  /**
   * Get sub-spikes by parent spike ID
   * 
   * Uses json-server query syntax: ?parentFK={id}
   * 
   * @param parentId Parent Spike ID (UUID)
   * @returns Observable<SubSpikeDto[]> Array of child sub-spike DTOs
   */
  getByParentId(parentId: string): Observable<SubSpikeDto[]> {
    return this.http.get<SubSpikeDto[]>(`${this.apiUrl}?parentFK=${parentId}`);
  }

  /**
   * Get sub-spike by ID
   * 
   * @param id SubSpike ID (UUID)
   * @returns Observable<SubSpikeDto> Single sub-spike DTO
   */
  getById(id: string): Observable<SubSpikeDto> {
    return this.http.get<SubSpikeDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new sub-spike
   * 
   * @param dto SubSpike data to create
   * @returns Observable<SubSpikeDto> Created sub-spike DTO
   */
  create(dto: SubSpikeDto): Observable<SubSpikeDto> {
    return this.http.post<SubSpikeDto>(this.apiUrl, dto);
  }

  /**
   * Update existing sub-spike
   * 
   * @param id SubSpike ID to update
   * @param dto Updated sub-spike data
   * @returns Observable<SubSpikeDto> Updated sub-spike DTO
   */
  update(id: string, dto: SubSpikeDto): Observable<SubSpikeDto> {
    return this.http.put<SubSpikeDto>(`${this.apiUrl}/${id}`, dto);
  }

  /**
   * Delete sub-spike
   * 
   * @param id SubSpike ID to delete
   * @returns Observable<void>
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
