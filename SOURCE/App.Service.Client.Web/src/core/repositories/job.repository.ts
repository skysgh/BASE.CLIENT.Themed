/**
 * Job Repository
 * 
 * Handles HTTP operations for job postings.
 * Extends modern RepositoryService base (composition pattern).
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { JobDto } from '../models/dtos/job.dto';
import { RepositoryService } from './base/repository.service';
import { SystemDiagnosticsTraceService } from '../services/system.diagnostics-trace.service';
import { SystemErrorService } from '../services/system.error.service';

@Injectable({ providedIn: 'root' })
export class JobRepository extends RepositoryService<JobDto> {
  
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_Jobs', logger, errorService);
  }

  /**
   * Get job postings by location
   * 
   * @param locationFK - Location foreign key
   * @returns Observable of job DTOs
   */
  getByLocation(locationFK: string): Observable<JobDto[]> {
    this.logger.debug(`${this.constructor.name}.getByLocation(${locationFK})`);
    
    return this.query({ locationFK });
  }

  /**
   * Get job postings by type
   * 
   * @param typeFK - Job type foreign key
   * @returns Observable of job DTOs
   */
  getByType(typeFK: string): Observable<JobDto[]> {
    this.logger.debug(`${this.constructor.name}.getByType(${typeFK})`);
    
    return this.query({ typeFK });
  }

  /**
   * Get enabled job postings only
   * 
   * @returns Observable of active job DTOs
   */
  getEnabled(): Observable<JobDto[]> {
    this.logger.debug(`${this.constructor.name}.getEnabled()`);
    
    return this.getAll().pipe(
      map(jobs => jobs.filter(job => job.enabled))
    );
  }

  /**
   * Get bookmarked jobs
   * 
   * @returns Observable of bookmarked job DTOs
   */
  getBookmarked(): Observable<JobDto[]> {
    this.logger.debug(`${this.constructor.name}.getBookmarked()`);
    
    return this.query({ bookmark: true });
  }
}
