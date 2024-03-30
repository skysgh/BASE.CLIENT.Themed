// Rx:
import { BehaviorSubject, Observable, map, of, switchMap, tap, timer } from 'rxjs';
// Ag:
import { Injectable } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
// Constants:
import { system as importedSystemConst } from '../constants/system';
// Services:
import { ItemsCollectionServiceBase } from './base/itemsCollection.service.base';
import { DiagnosticsTraceService } from './diagnostics.service';
import { SystemService } from './system.service';
import { NotificationsRepositoryService } from './repositories/system.notification.repository.service';
// Models:
import { SystemNotification } from '../models/data/notification.model';



/**
 * Service to collect together Messages and Alerts
 * intended for the current user.
 */
// Injectable Service, available everywhere
// as asingleton:
@Injectable({ providedIn: 'root' })
export class SystemNotificationService
  extends ItemsCollectionServiceBase<SystemNotification, string, SystemNotification>{

  protected override pollDelayInSeconds: number = 60;
  protected override itemKeyFieldName = 'id';


  private itemTypeFKA: string = '00000000-0000-0000-0000-000000000001';
  private itemTypeFKB: string = '00000000-0000-0000-0000-000000000002';

  constructor(
    diagnosticsTraceService: DiagnosticsTraceService,
    translate: TranslateService,
    cookieService: CookieService,
    private notificationsRepositoryService: NotificationsRepositoryService) {
    //Invoke super constructor, which invokes timer, etc.
    super(diagnosticsTraceService, translate);

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
  protected override filterFor(item: SystemNotification): boolean {
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
  protected override developMappedObject(item: SystemNotification): SystemNotification {
    return item;
    // In this contrived example, not doing much, just changing type:
    //return item;
    // Same thing in this simple case:
    //  var replacement: SystemNotification = {
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
  protected InvokeRepository(): Observable<SystemNotification[]> {
    this.diagnosticsTraceService.info("notificationsService.invokeRepository(...)");
    return this.notificationsRepositoryService.getPage();
  }

  /**
   * Abstract final method for any action
   * required at the end of the refreshment of the list
   */
  protected override onInitComplete(items: SystemNotification[]): void {
    // do things...
    this.diagnosticsTraceService.info("notificationsService.onInitComplete(...)");
  }
}




