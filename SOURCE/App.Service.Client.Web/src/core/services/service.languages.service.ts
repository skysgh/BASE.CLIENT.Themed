// Rx:
import { Observable, BehaviorSubject, of, timer } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
// Ag:
import { Injectable } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
// Constants:

// Services:
import { ServiceLanguagesRepositoryService } from './services/repositories/service-languages.repository.service';
import { TranslationService } from './translation.service';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
// Models:
import { ServiceLanguage } from '../models/data/service-language.model';
import { SystemLanguageVM } from '../models/service-Language.vto.model';
import { MappedItemsCollectionServiceBase } from './base/mapped-items-collection.service.base';
import { appsConfiguration } from '../../apps/configuration/implementations/apps.configuration';
import { SystemDefaultServices } from './system.default-services.service';


/** Service invoked from toolbar
 * to set current language.
 * 
 */
@Injectable({ providedIn: 'root' })
export class ServiceLanguagesService
  extends MappedItemsCollectionServiceBase
  <ServiceLanguage, string, ServiceLanguage> {



  // Don't poll:
  protected override pollDelayInSeconds: number = 0; //(60 * 1000);
  // Feild name to filter on.
  protected override itemKeyFieldName: string =
    appsConfiguration.others.core.constants.storage.db.columnNames.defaults.languageCode;

  // The key issue to keep in mind is that
  // front end components (eg: topbar)
  // are depending on this service.
  // But its observable list is in turn waiting for
  // a repo to return results.
  // So it's a double observable if you will.
  constructor(
    private defaultServices: SystemDefaultServices,
    /*already defined in super*/ translate: TranslateService,
    private cookieService: CookieService,
    private ServiceLanguagesRepositoryService: ServiceLanguagesRepositoryService,
    override translationService: TranslationService
  ) {
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
  protected override ServiceSpecificImplementationToFilterFor(item: ServiceLanguage): boolean {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ServiceSpecificImplementationToFilterFor()`);

    return (item.enabled == true);
  }

  /**
   * Abstract method to map TDto to TVto.
   * In many cases it just be a simple case of
   * TDto being the same as TVto,
   * in which case it's a simple case of
`   * "return item";
   * @param item
   */
  protected override ServiceSpecificImplementationToDevelopMappedObject(item: ServiceLanguage): SystemLanguageVM {

    // cannot reference this.diagnosticsTraceService
    // because we are not in the context of this.
    // Annoying!
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ServiceSpecificImplementationToDevelopMappedObject(...)`);
    // In this contrived example, not doing much, just changing type:
    //return item;
    // Same thing in this simple case:
    var replacement: SystemLanguageVM = {
      id: item.id,
      serviceId:item.serviceId,
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
  protected ServiceSpecificImplementationOfInvokeRepository(): Observable<ServiceLanguage[]> {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ServiceSpecificImplementationOfInvokeRepository(...)`);

    return this.ServiceLanguagesRepositoryService.getPage();
  }

  /**
   * Abstract final method for any action
   * required at the end of the refreshment of the list
   */
  protected override ServiceSpecificImplementationOfOnInitComplete(items: SystemLanguageVM[]): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ServiceSpecificImplementationOfOnInitComplete(...)`);

    this.initLanguages(items);
  }


  // Not sure who calls this:
  protected initLanguages(items: SystemLanguageVM[]): void {

    this.diagnosticsTraceService.info(`${this.constructor.name }.initLanguages(...)`);
 
    var languageCodes =
      items.map(item => item.languageCode)
        .filter((v): v is string => typeof (v) === 'string');

    this.translationService.initializeTranslator(languageCodes);

  }


  /***
 * Cookie Language set
 */
  public setLanguage(language: string) {
    this.diagnosticsTraceService.info(`${this.constructor.name}.setLanguage('${language}')`);

    // use appropropriate service to set cookie:
    this.translationService.setLanguage(language);

  }


  public getLanguage() {
    this.diagnosticsTraceService.info(`${this.constructor.name}.getLanguage()`);

    // use appropropriate service to get cookie:
    var result = this.translationService.getDefaultLanguageCode();

    this.diagnosticsTraceService.debug(`...result:'${result}'`);

    return result;
  }
}
