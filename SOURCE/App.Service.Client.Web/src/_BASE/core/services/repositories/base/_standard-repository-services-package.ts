import { Injectable } from '@angular/core';
import { SystemEnvironmentService } from '../../system.environment.service';
import { SystemDiagnosticsTraceService } from '../../system.diagnostics-trace.service';
import { SystemErrorService } from '../../system.error.service';
import { TypeService } from '../../type.service';
import { ObjectMappingService } from '../../infrastructure/objectMapping.service';
import { SessionStorageService } from '../../infrastructure/SessionStorageService';
import { UrlService } from '../../url.service';
import { ArrayService } from '../../array.service';
import { ServiceService } from '../../system.service.service';
import { ServiceTenancyService } from '../../TenantService';
//NO. TODO: I think this causes a import a loop? { ServiceLanguagesService } from '../../service.languages.service';

// Models:
//
// Data:
//
// Describe the service:
@Injectable({ providedIn: 'root' })

/**
* Injectable abstract base for
* services to provide generic repository services that
* wrap calls to the backend service endpoints, with the option
* of mapping the return objects - DTOs from a server API - to
* something more ready for the front end.
* An easy example is converting a typeFK to an image name
* (although leave the pathing to the front end) and so forth.

* Used some learnings from:
* https://betterprogramming.pub/a-generic-http-service-approach-for-angular-applications-a7bd8ff6a068
* https://www.positronx.io/angular-httpclient-http-service/
 */
export class RepositoryStandardServicesPackage {
    constructor(
        public typeService: TypeService,
        public arrayService: ArrayService,
      public environmentService: SystemEnvironmentService,
      public serviceService: ServiceService,
        public tenancyService: ServiceTenancyService,
        public diagnosticsTraceService: SystemDiagnosticsTraceService,
        public errorService: SystemErrorService,
        public objectMappingService: ObjectMappingService,
        public sessionStorageService: SessionStorageService,
      public urlService: UrlService


    ) { }

}
