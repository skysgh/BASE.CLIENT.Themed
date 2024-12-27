// Rx:
//
// Ag:
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Etc:
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
// Constants:
import { system as importedSystemConst } from '../constants/system';
// Services:
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
import { SystemService } from './system.service';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';


@Injectable({ providedIn: 'root' })
export class TranslationService {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  private C_LANG: string = 'lang';

  // Hack: small chance they got to a 404 before they got anywhere:
  private previouslySetDefaultLanguage?: string;


  /**
   * Constructor
   * @param diagnosticsTraceService
   * @param systemService
   * @param translate
   * @param cookieService
   */
  public constructor(
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    private systemService: SystemService,
    private translateService: TranslateService,
    private cookieService: CookieService,
  ) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)

  }



  public createTranslateLoader(http: HttpClient): any {
    let path: string = this.systemService.system.sources.assets.public.static.core.i18n;

    return
    new TranslateHttpLoader(
      http,
      path,
      '.json');
  }


  public initializeTranslator(languageCodes: string[]): void {
    this.diagnosticsTraceService.info("TranslationService.initLanguages(...)");

    this.translateService.addLangs(languageCodes);

    this.initialiseTranslatorsCurrentLanguage();


  }

  public initialiseTranslatorsCurrentLanguage(): string {
    var languageCode = this.getDefaultLanguageCode();

    if (languageCode != this.previouslySetDefaultLanguage) {
      this.translateService.use(languageCode);
      this.previouslySetDefaultLanguage = languageCode;
      this.systemService.system.dynamic.configuration.defaultLanguageCode = languageCode;
    }
    return languageCode;
  }

  public setLanguage(lang: string) {
    this.translateService.use(lang);

    this.cookieService.set('lang', lang);
  }


  public instant(key: string): string {
    return this.translateService.instant(key);
  }

   
  public async get(key: string): Promise<string> {
    return lastValueFrom(this.translateService.get(key)); // Convert Observable to Promise}
  }

  public getDefaultLanguageCode(): string {
    let languageCode: any;
    if (this.cookieService.check(this.C_LANG)) {
      languageCode = this.cookieService.get(this.C_LANG);
    }
    else {
      languageCode = this.translateService.getBrowserLang(); // which is same as: navigator.language;//  
    }
    languageCode = languageCode || this.systemService.system.dynamic.configuration.defaultLanguageCode;

    return languageCode;
  }


}
