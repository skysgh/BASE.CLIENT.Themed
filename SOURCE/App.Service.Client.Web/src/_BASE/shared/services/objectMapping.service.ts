// Ag:
import { Injectable } from '@angular/core';
import { createMapper, createMap, Mapper, ModelIdentifier } from '@automapper/core';
import { classes } from '@automapper/classes';
import { DiagnosticsTraceService } from './diagnostics.service';

// Create and export the mapper
/*export*/
  const mapper = createMapper({
  strategyInitializer: classes(),
});


// Describe the service:
@Injectable({ providedIn: 'root' })

/**
 * Injectable Service
 * to map DTOs to system entities and back again.
 */
export class ObjectMappingService {
  //expose the singleton created earlier:
  mapper: Mapper = mapper;

  constructor(private diagnosticsTraceService: DiagnosticsTraceService) {

  }

  /**
   * Call to register a map in the singleton mapper.
   * 
   * @param sourceDef
   * @param targetDef
   */
  createAndRegisterMap(sourceDef:any, targetDef:any) {
    createMap(this.mapper, sourceDef, targetDef);
  }

  /**
   * Map from srcObject of type srcIdentifier to a newly created targetIdentifier
   * 
   * @param srcObject
   * @paraam sourceIdentifier
   * @param targetIdentifier
   */
  map(srcObject: any, sourceIdentifier: ModelIdentifier, targetIdentifier: ModelIdentifier) {
    this.mapper.map( srcObject, sourceIdentifier,targetIdentifier);
  }
}
