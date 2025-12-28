import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RepositoryService } from '../../../core/repositories/base/repository.service';
import { ProductDto } from '../models/dtos/product.dto';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';
import { SystemErrorService } from '../../../core/services/system.error.service';

@Injectable({ providedIn: 'root' })
export class ProductRepository extends RepositoryService<ProductDto> {
  constructor(
    http: HttpClient,
    logger: SystemDiagnosticsTraceService,
    errorService: SystemErrorService
  ) {
    super(http, '/api/rest/base_service_Products', logger, errorService);
  }
}
