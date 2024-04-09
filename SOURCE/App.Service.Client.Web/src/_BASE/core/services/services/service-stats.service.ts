// Rx:
import { Observable, BehaviorSubject, of, timer } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
// Ag:
import { Injectable } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';

// Constants:
import { system as importedSystemConst } from '../../constants/system';
// Services:
import { MappedItemsCollectionServiceBase } from '../base/mappedItemsCollection.service.base';
import { SystemDiagnosticsTraceService } from '../system.diagnostics-trace.service';
// Models:
import { ServiceStatsRepositoryService } from './repositories/service-stats.repository.service';
import { ServiceStat } from '../../models/data/service-stat.model';
import { ServiceStatVTO } from '../../models/view/service-stat.vto.model';
// Models:


/**
 * Service to return Stats about a service.
 * Used to render something (eg counters)
 * on a pitch/sales page.
 */
@Injectable({ providedIn: 'root' })
export class ServiceStatsService
  extends MappedItemsCollectionServiceBase
  <ServiceStat, string, ServiceStatVTO> {
  // Make system/env variables avaiable to class & view template:
  // already defined in superclass: public system = importedSystemConst;

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
    private systemStatsRepositoryService: ServiceStatsRepositoryService,
  ) {
    super(diagnosticsTraceService, translate);

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)

    // call explicitly from sub class, not super,
    // as otherwise repositorySErvice will not yet have been made into a private property,
    this.init();
  }







  /**
 * Abstract method to filter on TVtos.
 * @param item
 */
  protected override ServiceSpecificImplementationToFilterFor(item: ServiceStatVTO): boolean {
    // no filtering being performed
    // as underlying repository should have
    // already filtered for
    // service.id
    return true;
  }

  /**
   * Abstract method to map TDto to TVto.
   * In many cases it just be a simple case of
   * TDto being the same as TVto,
   * in which case it's a simple case of
`   * "return item";
   * @param item
   */
  protected override ServiceSpecificImplementationToDevelopMappedObject(item: ServiceStat): ServiceStatVTO {
    // cannot reference this.diagnosticsTraceService
    // because we are not in the context of this.
    // Annoying!
    this.diagnosticsTraceService.debug(`${this.constructor.name}.developMappedObject(...)`);

    var replacement: ServiceStatVTO = {
      id: item.id,
      enabled: item.enabled,
      title: item.title,
      value: item.value,
      description: item.description,
    }

    return replacement;
  }

  /**
   * Abstract method to invoke the repositoryservice
   * method of choice to return an array of TDtos
   */
  protected ServiceSpecificImplementationOfInvokeRepository(): Observable<ServiceStat[]> {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.invokeRepository(...)`);

    // TODO: Add ServiceId restrictions/filtering.
    // TODO: Add enabled restrictions/filtering.
    return this.systemStatsRepositoryService.getPage();
  }

  /**
   * Abstract final method for any action
   * required at the end of the refreshment of the list
   */
  protected override ServiceSpecificImplementationOfOnInitComplete(items: ServiceStatVTO[]): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.onInitComplete(...)`);
    var check = this.items$;
  }

}
