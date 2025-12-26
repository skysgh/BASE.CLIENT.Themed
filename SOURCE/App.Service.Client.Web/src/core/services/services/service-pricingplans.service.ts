// Rx:
import { Observable, BehaviorSubject, of, timer } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
// Ag:
import { Injectable } from '@angular/core';
// Etc:

// Constants:
//
// Services:
import { MappedItemsCollectionServiceBase } from '../base/mapped-items-collection.service.base';
import { SystemDiagnosticsTraceService } from '../system.diagnostics-trace.service';
import { SystemPricingPlanRepositoryService } from './repositories/service-pricingplan.repository.service';
import { TranslationService } from '../translation.service';
// Models:
import { ServicePricingPlan } from '../../models/data/service-pricing-plan.model';
import { ServicePricingPlanVTO } from '../../models/service.pricingplan.vto.model';
import { appsConfiguration } from '../../../sites.app/configuration/implementations/apps.configuration';

// Models:


/** Service to retrieve Logos of companies that trust
 * this service.
 *
 * Distinct from ServiceEndorsementsService which is quotes (not images/logos)
 * provided by end users as oppossed to companies (logo images).
 */
@Injectable({ providedIn: 'root' })
export class ServicePricingPlansService
  extends MappedItemsCollectionServiceBase
  <ServicePricingPlan, string, ServicePricingPlanVTO> {

  // Don't poll:
  protected override pollDelayInSeconds: number = 0; //(60 * 1000);
  protected override itemKeyFieldName: string = appsConfiguration.others.core.constants.storage.db.columnNames.defaults.id;

  // The key issue to keep in mind is that
  // front end components (eg: topbar)
  // are depending on this service.
  // But its observable list is in turn waiting for
  // a repo to return results.
  // So it's a double observable if you will.
  constructor(
    diagnosticsTraceService: SystemDiagnosticsTraceService,
    translationService: TranslationService,
    private systemPricingPlansRepositoryService: SystemPricingPlanRepositoryService
  ) {
    super(diagnosticsTraceService, translationService);

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)

    // call explicitly from sub class, not super,
    // as otherwise repositorySErvice will not yet have been made into a private property,
    // for exampel
    this.init();
  }







  /**
 * Abstract method to filter on TVtos.
 * @param item
 */
  protected override ServiceSpecificImplementationToFilterFor(item: ServicePricingPlanVTO): boolean {
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
  protected override ServiceSpecificImplementationToDevelopMappedObject(item: ServicePricingPlan): ServicePricingPlanVTO {
    // cannot reference this.diagnosticsTraceService
    // because we are not in the context of this.
    // Annoying!
    this.diagnosticsTraceService.debug(`${this.constructor.name}.developMappedObject(...)`);

    var replacement: ServicePricingPlanVTO = item as ServicePricingPlanVTO;

    return replacement;
  }

  /**
   * Abstract method to invoke the repositoryservice
   * method of choice to return an array of TDtos
   */
  protected ServiceSpecificImplementationOfInvokeRepository(): Observable<ServicePricingPlan[]> {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.invokeRepository(...)`);
    return this.systemPricingPlansRepositoryService.getPage();
  }

  /**
   * Abstract final method for any action
   * required at the end of the refreshment of the list
   */
  protected override ServiceSpecificImplementationOfOnInitComplete(items: ServicePricingPlanVTO[]): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.onInitComplete(...)`);
    var check = this.items$;
  }

}
