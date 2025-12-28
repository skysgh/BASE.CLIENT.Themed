import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { SystemDiagnosticsTraceService } from '../../services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../services/system.error.service';

/**
 * Modern generic repository service using composition over inheritance.
 * 
 * Provides standard CRUD operations for any entity type.
 * No inheritance required - just instantiate with your DTO type.
 * 
 * **Pattern Benefits:**
 * - Simple composition (no inheritance chains)
 * - Type-safe CRUD operations
 * - Consistent error handling
 * - Automatic retry logic
 * - Diagnostic logging built-in
 * 
 * **Usage:**
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * export class FeatureRepository extends RepositoryService<FeatureDto> {
 *   constructor(http: HttpClient, logger: SystemDiagnosticsTraceService, errorService: SystemErrorService) {
 *     super(http, '/api/features', logger, errorService);
 *   }
 * }
 * ```
 */
export abstract class RepositoryService<TDto> {
  
  constructor(
    protected http: HttpClient,
    protected baseUrl: string,
    protected logger: SystemDiagnosticsTraceService,
    protected errorService?: SystemErrorService
  ) {
    this.logger.debug(`${this.constructor.name} initialized for ${baseUrl}`);
  }

  /**
   * Get all entities
   */
  getAll(): Observable<TDto[]> {
    this.logger.debug(`${this.constructor.name}.getAll()`);
    
    return this.http
      .get<TDto[]>(this.baseUrl, { headers: this.buildHeaders() })
      .pipe(
        retry(1),
        catchError(err => this.handleError(err, 'getAll'))
      );
  }

  /**
   * Get paginated entities
   */
  getPage(page: number = 1, pageSize: number = 20): Observable<TDto[]> {
    this.logger.debug(`${this.constructor.name}.getPage(${page}, ${pageSize})`);
    
    const url = `${this.baseUrl}?page=${page}&_per_page=${pageSize}`;
    
    return this.http
      .get<TDto[]>(url, { headers: this.buildHeaders() })
      .pipe(
        retry(1),
        catchError(err => this.handleError(err, 'getPage'))
      );
  }

  /**
   * Get single entity by ID
   */
  getById(id: string): Observable<TDto> {
    this.logger.debug(`${this.constructor.name}.getById(${id})`);
    
    const url = `${this.baseUrl}/${id}`;
    
    return this.http
      .get<TDto>(url, { headers: this.buildHeaders() })
      .pipe(
        retry(1),
        catchError(err => this.handleError(err, 'getById'))
      );
  }

  /**
   * Create new entity
   */
  create(entity: Partial<TDto>): Observable<TDto> {
    this.logger.debug(`${this.constructor.name}.create()`);
    
    return this.http
      .post<TDto>(this.baseUrl, entity, { headers: this.buildHeaders() })
      .pipe(
        retry(1),
        catchError(err => this.handleError(err, 'create'))
      );
  }

  /**
   * Update existing entity
   */
  update(id: string, entity: Partial<TDto>): Observable<TDto> {
    this.logger.debug(`${this.constructor.name}.update(${id})`);
    
    const url = `${this.baseUrl}/${id}`;
    
    return this.http
      .put<TDto>(url, entity, { headers: this.buildHeaders() })
      .pipe(
        retry(1),
        catchError(err => this.handleError(err, 'update'))
      );
  }

  /**
   * Partially update existing entity
   */
  patch(id: string, entity: Partial<TDto>): Observable<TDto> {
    this.logger.debug(`${this.constructor.name}.patch(${id})`);
    
    const url = `${this.baseUrl}/${id}`;
    
    return this.http
      .patch<TDto>(url, entity, { headers: this.buildHeaders() })
      .pipe(
        retry(1),
        catchError(err => this.handleError(err, 'patch'))
      );
  }

  /**
   * Delete entity
   */
  delete(id: string): Observable<void> {
    this.logger.debug(`${this.constructor.name}.delete(${id})`);
    
    const url = `${this.baseUrl}/${id}`;
    
    return this.http
      .delete<void>(url, { headers: this.buildHeaders() })
      .pipe(
        retry(1),
        catchError(err => this.handleError(err, 'delete'))
      );
  }

  /**
   * Query with custom filters
   */
  query(filters: Record<string, any>): Observable<TDto[]> {
    this.logger.debug(`${this.constructor.name}.query()`);
    
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, String(value));
      }
    });
    
    const url = `${this.baseUrl}?${params.toString()}`;
    
    return this.http
      .get<TDto[]>(url, { headers: this.buildHeaders() })
      .pipe(
        retry(1),
        catchError(err => this.handleError(err, 'query'))
      );
  }

  /**
   * Build HTTP headers (override in subclass if needed)
   */
  protected buildHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  /**
   * Handle HTTP errors
   */
  protected handleError(error: any, operation: string): Observable<never> {
    const message = `${this.constructor.name}.${operation} failed: ${error.message || error}`;
    
    this.logger.error(message);
    
    if (this.errorService) {
      this.errorService.report(error);
    }
    
    return throwError(() => new Error(message));
  }
}
