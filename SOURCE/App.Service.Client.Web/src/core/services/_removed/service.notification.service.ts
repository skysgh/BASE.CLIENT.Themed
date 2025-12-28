// Rx:
import { BehaviorSubject, Observable, map, of, switchMap, tap, timer } from 'rxjs';
// Ag:
import { Injectable } from '@angular/core';
// Etc:
import {
} from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
// Constants:

// Services:
import { MappedItemsCollectionServiceBase } from './base/mapped-items-collection.service.base';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
//import { SystemService } from './system.service';
import { NotificationsRepositoryService } from './services/repositories/service-notification.repository.service';
// Models:
import { ServiceNotification } from '../models/data/service-notification.model';
import { TranslationService } from './translation.service';
import { SystemDefaultServices } from './system.default-services.service';



/**
 * Service to collect together Messages and Alerts
 * intended for the current user.
 */
// Injectable Service, available everywhere
// as asingleton:
@Injectable({ providedIn: 'root' })
export class ServiceNotificationsService
  extends MappedItemsCollectionServiceBase<ServiceNotification, string, ServiceNotification>{
  // Make system/env variables avaiable to class & view template:

  protected override pollDelayInSeconds: number = 60;
  protected override itemKeyFieldName = 'id';


  private itemTypeFKA: string = '00000000-0000-0000-0000-000000000001';
  private itemTypeFKB: string = '00000000-0000-0000-0000-000000000002';

  constructor(
    private defaultServices: SystemDefaultServices,
    override translationService: TranslationService,
    cookieService: CookieService,
    private notificationsRepositoryService: NotificationsRepositoryService) {
    //Invoke super constructor, which invokes timer, etc.
    super(defaultServices.diagnosticsTraceService, translationService);

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
  protected override ServiceSpecificImplementationToFilterFor(item: ServiceNotification): boolean {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ServiceSpecificImplementationToFilterFor(...)`);

    // Not much of a filter on this one
    var result = (item.typeFK == this.itemTypeFKA);
    return result;
  }

  /**
   * Abstract method to map TDto to TVto.
   * In many cases it just be a simple case of
   * TDto being the same as TVto,
   * in which case it's a simple case of
   * "return item";
   * @param item
   */
  protected override ServiceSpecificImplementationToDevelopMappedObject(item: ServiceNotification): ServiceNotification {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ServiceSpecificImplementationToDevelopMappedObject(...)`);

    return item;
    // In this contrived example, not doing much, just changing type:
    //return item;
    // Same thing in this simple case:
    //  var replacement: ServiceNotification = {
    //    id: item.id,
    //    enabled: item.enabled,
    //    imageId: item.imageId,
    //    title: item.title,
    //    description: item.description,
    //  }
    //  return replacement;
  }

  /**
   * Abstract method to invoke the repositoryservice
   * method of choice to return an array of TDtos
   */
  protected ServiceSpecificImplementationOfInvokeRepository(): Observable<ServiceNotification[]> {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ServiceSpecificImplementationOfInvokeRepository(...)`);

    return this.notificationsRepositoryService.getPage();
  }

  /**
   * Abstract final method for any action
   * required at the end of the refreshment of the list
   */
  protected override ServiceSpecificImplementationOfOnInitComplete(items: ServiceNotification[]): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ServiceSpecificImplementationOfOnInitComplete(...)`);
  }
}




