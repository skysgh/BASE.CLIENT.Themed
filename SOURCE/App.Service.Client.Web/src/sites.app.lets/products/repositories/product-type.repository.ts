import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { ProductTypeDto } from '../models/dtos/product-type.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class ProductTypeRepository extends RepositoryService<ProductTypeDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_ProductTypes', logger, errorService);
  }
}
