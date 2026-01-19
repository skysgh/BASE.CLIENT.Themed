/**
 * Star System Repository
 * 
 * Handles HTTP communication with Star System API endpoints.
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
 * - Stateless (no caching, no signals - that's the service layer)
 * - API URL comes from constants
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { astronomyConstants } from '../constants';
import { StarSystemDto, PlanetDto, AstronomerDto } from '../models/dtos';

@Injectable({ providedIn: 'root' })
export class StarSystemRepository {
  private readonly apiUrl = astronomyConstants.apis.starSystems;

  constructor(private http: HttpClient) {}

  /**
   * Get all star systems
   */
  getAll(): Observable<StarSystemDto[]> {
    return this.http.get<StarSystemDto[]>(this.apiUrl);
  }

  /**
   * Get star system by ID
   */
  getById(id: string): Observable<StarSystemDto> {
    return this.http.get<StarSystemDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new star system
   */
  create(dto: StarSystemDto): Observable<StarSystemDto> {
    return this.http.post<StarSystemDto>(this.apiUrl, dto);
  }

  /**
   * Update existing star system
   */
  update(id: string, dto: StarSystemDto): Observable<StarSystemDto> {
    return this.http.put<StarSystemDto>(`${this.apiUrl}/${id}`, dto);
  }

  /**
   * Delete star system
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class PlanetRepository {
  private readonly apiUrl = astronomyConstants.apis.planets;

  constructor(private http: HttpClient) {}

  /**
   * Get all planets
   */
  getAll(): Observable<PlanetDto[]> {
    return this.http.get<PlanetDto[]>(this.apiUrl);
  }

  /**
   * Get planets by star system ID
   */
  getByStarSystemId(starSystemId: string): Observable<PlanetDto[]> {
    return this.http.get<PlanetDto[]>(`${this.apiUrl}?starSystemId=${starSystemId}`);
  }

  /**
   * Get planet by ID
   */
  getById(id: string): Observable<PlanetDto> {
    return this.http.get<PlanetDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new planet
   */
  create(dto: PlanetDto): Observable<PlanetDto> {
    return this.http.post<PlanetDto>(this.apiUrl, dto);
  }

  /**
   * Update existing planet
   */
  update(id: string, dto: PlanetDto): Observable<PlanetDto> {
    return this.http.put<PlanetDto>(`${this.apiUrl}/${id}`, dto);
  }

  /**
   * Delete planet
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class AstronomerRepository {
  private readonly apiUrl = astronomyConstants.apis.astronomers;

  constructor(private http: HttpClient) {}

  /**
   * Get all astronomers
   */
  getAll(): Observable<AstronomerDto[]> {
    return this.http.get<AstronomerDto[]>(this.apiUrl);
  }

  /**
   * Get astronomer by ID
   */
  getById(id: string): Observable<AstronomerDto> {
    return this.http.get<AstronomerDto>(`${this.apiUrl}/${id}`);
  }
}
