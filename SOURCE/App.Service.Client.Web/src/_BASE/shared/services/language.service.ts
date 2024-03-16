import { Observable, BehaviorSubject, of, timer } from 'rxjs';
import { tap , map, switchMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { SystemLanguagesRepositoryService } from './repositories/system.languages.repository.service';
import { SystemLanguage } from '../models/data/system-language';
import { DiagnosticsTraceService } from './diagnostics.service';
import { SystemNotification } from '../models/data/notification.model';
import { ItemsCollectionServiceBase } from './base/itemsCollection.service.base';
import { TranslationService } from './translation.service';

// Example
class SystemLanguageVM extends SystemLanguage {

}

@Injectable({ providedIn: 'root' })
export class LanguageService extends ItemsCollectionServiceBase<SystemLanguage, string, SystemLanguage> {



  // Don't poll:
  protected override pollDelayInSeconds: number = 0; //(60 * 1000);
  protected override itemKeyFieldName: string = 'languageCode';

  // The key issue to keep in mind is that
  // front end components (eg: topbar)
  // are depending on this service.
  // But its observable list is in turn waiting for
  // a repo to return results.
  // So it's a double observable if you will.
  constructor(
    diagnosticsTraceService: DiagnosticsTraceService,
    translate: TranslateService,
    private cookieService: CookieService,
    private systemLanguagesRepositoryService: SystemLanguagesRepositoryService,
    private translationService: TranslationService
  ) {
    super(diagnosticsTraceService, translate);

    // call explicitly from sub class, not super,
    // as otherwise repositorySErvice will not yet have been made into a private property,
    // for exampel
    this.init();
  }







  /**
 * Abstract method to filter on TVtos.
 * @param item
 */
  protected override filterFor(item: SystemLanguage): boolean {
    return (item.enabled == true);
  }

  /**
   * Abstract method to map TDto to TVto.
   * In many cases it just be a simple case of
   * TDto being the same as TVto,
   * in which case it's a simple case of
   * "return item";
   * @param item
   */
  protected override developMappedObject(item: SystemLanguage): SystemLanguageVM {
    // cannot reference this.diagnosticsTraceService
    // because we are not in the context of this.
    // Annoying!
    this.diagnosticsTraceService.info("languageService.developMappedObject(...)");
    // In this contrived example, not doing much, just changing type:
    //return item;
    // Same thing in this simple case:
    var replacement: SystemLanguageVM = {
      id: item.id,
      enabled: item.enabled,
      imageId: item.imageId,
      title: item.title,
      description: item.description,
      languageCode: item.languageCode
    }
    return replacement;
  }

  /**
   * Abstract method to invoke the repositoryservice
   * method of choice to return an array of TDtos
   */
  protected InvokeRepository(): Observable<SystemLanguage[]> {
    this.diagnosticsTraceService.info("languageService.invokeRepository(...)");
    return this.systemLanguagesRepositoryService.getPageEnabled();
  }

  /**
   * Abstract final method for any action
   * required at the end of the refreshment of the list
   */
  protected override onInitComplete(items: SystemLanguageVM[]): void {
    this.diagnosticsTraceService.info("languageService.onInitComplete(...)");
    this.initLanguages(items);
  }


  // Not sure who calls this:
  protected initLanguages(items: SystemLanguageVM[]): void {
    this.diagnosticsTraceService.info("languageService.initLanguages(...)");
 
    var languageCodes =
      items.map(item => item.languageCode)
        .filter((v): v is string => typeof (v) === 'string');

    this.translationService.initializeTranslator(languageCodes);


  }


  /***
 * Cookie Language set
 */
  public setLanguage(language: string) {
    this.translationService.setLanguage(language);
  }

}
