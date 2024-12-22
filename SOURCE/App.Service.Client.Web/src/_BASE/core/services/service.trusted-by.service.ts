// Rx:
import { Observable, BehaviorSubject, of, timer } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
// Ag:
import { Injectable } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
// Constants:
import { system as importedSystemConst } from '../constants/system';
// Services:
import { MappedItemsCollectionServiceBase } from './base/mapped-items-collection.service.base';
import { TranslationService } from './translation.service';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
import { ServiceTrustedBy } from '../models/data/service-trustedby.model';
import { ServiceTrustedByVTO } from '../models/view/service.trusted-by.vto.model';
import { SystemTrustedByRepositoryService } from './services/repositories/service-trustedby.repository.service';
// Models:


/** Service to retrieve Logos of companies that trust
 * this service.
 *
 * Distinct from ServiceEndorsementsService which is quotes (not images/logos)
 * provided by end users as oppossed to companies (logo images).
 */
@Injectable({ providedIn: 'root' })
export class ServiceTrustedByService
  extends MappedItemsCollectionServiceBase
  <ServiceTrustedBy, string, ServiceTrustedByVTO> {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;


  // Don't poll:
  protected override pollDelayInSeconds: number = 0; //(60 * 1000);
  protected override itemKeyFieldName: string = importedSystemConst.storage.db.defaultFieldNames.id;

  // The key issue to keep in mind is that
  // front end components (eg: topbar)
  // are depending on this service.
  // But its observable list is in turn waiting for
  // a repo to return results.
  // So it's a double observable if you will.
  constructor(
    diagnosticsTraceService: SystemDiagnosticsTraceService,
    translate: TranslateService,
    private cookieService: CookieService,
    private systemTrustedByRepositoryService: SystemTrustedByRepositoryService,
    private translationService: TranslationService
  ) {
    super(diagnosticsTraceService, translate);

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)

    // call explicitly from sub class, not super,
    // as otherwise injected services - including repositorySErvices --
    // will not yet have been made into a private property,
    this.init();
  }







  /**
 * Abstract method to filter on TVtos.
 * @param item
 */
  protected override ServiceSpecificImplementationToFilterFor(item: ServiceTrustedByVTO): boolean {
    // no filtering being performed
    // as underlying repository should have
    // already filtered for
    // service.id
    return (true);
  }

  /**
   * Abstract method to map TDto to TVto.
   * In many cases it just be a simple case of
   * TDto being the same as TVto,
   * in which case it's a simple case of
`   * "return item";
   * @param item
   */
  protected override ServiceSpecificImplementationToDevelopMappedObject(item: ServiceTrustedBy): ServiceTrustedByVTO {
    // cannot reference this.diagnosticsTraceService
    // because we are not in the context of this.
    // Annoying!
    this.diagnosticsTraceService.debug(`${this.constructor.name }.ServiceSpecificImplementationToDevelopMappedObject(...)`);
    // In this contrived example, not doing much, just changing type:
    //return item;
    // Same thing in this simple case:
    var replacement: ServiceTrustedByVTO = {
      // not much to it actually:
      title: item.title,
      imageName: item.imageName
    }

    return replacement;
  }

  /**
   * Abstract method to invoke the repositoryservice
   * method of choice to return an array of TDtos
   */
  protected ServiceSpecificImplementationOfInvokeRepository(): Observable<ServiceTrustedBy[]> {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ServiceSpecificImplementationOfInvokeRepository(...)`);
    return this.systemTrustedByRepositoryService.getPage();
  }

  /**
   * Abstract final method for any action
   * required at the end of the refreshment of the list
   */
  protected override ServiceSpecificImplementationOfOnInitComplete(items: ServiceTrustedByVTO[]): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ServiceSpecificImplementationOfOnInitComplete(...)`);
  }

}
