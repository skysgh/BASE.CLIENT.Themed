import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RepositoryService } from './base/repository.service';
import { ServiceFeatureDto } from '../models/dtos/service-feature.dto';
import { SystemDiagnosticsTraceService } from '../services/system.diagnostics-trace.service';
import { SystemErrorService } from '../services/system.error.service';

/**
 * Service Feature Repository
 * 
 * Handles data access for service features using modern composition pattern.
 * No inheritance chains - just extends generic RepositoryService.
 * 
 * **Pattern Benefits:**
 * - Clean composition (no complex base class chains)
 * - Type-safe operations (ServiceFeatureDto)
 * - Easy to test (standard CRUD + custom methods)
 * - Follows single responsibility principle
 * 
 * **Usage:**
 * ```typescript
 * // In service
 * constructor(private featureRepo: ServiceFeatureRepository) {}
 * 
 * loadFeatures() {
 *   this.featureRepo.getAll()
 *     .pipe(map(dtos => dtos.map(mapDtoToViewModel)))
 *     .subscribe(vms => this.features.set(vms));
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ServiceFeatureRepository extends RepositoryService<ServiceFeatureDto> {
  
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    // API endpoint from configuration
    // Using json-server convention: /api/base_service_Features
    super(
      http,
      '/api/base_service_Features',
      logger,
      errorService
    );
    
    this.logger.debug(`${this.constructor.name} initialized`);
  }

  /**
   * Get only enabled features
   * 
   * Custom query method specific to features.
   * Filters server-side for better performance.
   */
  getEnabled(): Observable<ServiceFeatureDto[]> {
    this.logger.debug(`${this.constructor.name}.getEnabled()`);
    
    return this.query({ enabled: true });
  }

  /**
   * Get features for specific service
   * 
   * @param serviceId - Service identifier
   */
  getByServiceId(serviceId: string): Observable<ServiceFeatureDto[]> {
    this.logger.debug(`${this.constructor.name}.getByServiceId(${serviceId})`);
    
    return this.query({ serviceId });
  }

  /**
   * Get enabled features for specific service
   * 
   * Combines service filter with enabled filter.
   * 
   * @param serviceId - Service identifier
   */
  getEnabledByServiceId(serviceId: string): Observable<ServiceFeatureDto[]> {
    this.logger.debug(`${this.constructor.name}.getEnabledByServiceId(${serviceId})`);
    
    return this.query({ 
      serviceId, 
      enabled: true 
    });
  }

  /**
   * Toggle feature enabled state
   * 
   * Convenience method for enable/disable operations.
   * 
   * @param id - Feature ID
   * @param enabled - New enabled state
   */
  toggleEnabled(id: string, enabled: boolean): Observable<ServiceFeatureDto> {
    this.logger.debug(`${this.constructor.name}.toggleEnabled(${id}, ${enabled})`);
    
    return this.patch(id, { enabled });
  }
}
