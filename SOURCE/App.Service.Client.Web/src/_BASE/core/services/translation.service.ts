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


@Injectable({ providedIn: 'root' })
export class TranslationService {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  private C_LANG: string = 'lang';

  // Hack: small chance they got to a 404 before they got anywhere:
  private previouslySetDefaultLanguage? : string;
  public constructor(
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    private systemService: SystemService,
    private translate: TranslateService,
    private cookieService: CookieService,
) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
    
  }

  public createTranslateLoader(http: HttpClient): any {
    return
    new TranslateHttpLoader(
      http,
      this.systemService.system.sources.assets.public.static.default.i18n,
      '.json');
  }

//  public translate(textName: string) {
//    this.translate.getTranslation(textName).subscribe(x=>x)
  //  }

  public initializeTranslator(languageCodes: string[]): void {
    this.diagnosticsTraceService.info("TranslationService.initLanguages(...)");

    this.translate.addLangs(languageCodes);

    this.initialiseTranslatorsCurrentLanguage();


  }

  public initialiseTranslatorsCurrentLanguage(): string{
    var languageCode = this.getDefaultLanguageCode();

    if (languageCode != this.previouslySetDefaultLanguage) {
      this.translate.use(languageCode);
      this.previouslySetDefaultLanguage = languageCode;
      this.systemService.system.dynamic.configuration.defaultLanguageCode = languageCode;
    }
    return languageCode;
  }

  public setLanguage(lang: string) {
    this.translate.use(lang);

    this.cookieService.set('lang', lang);
  }
  public instant(key: string): string {
    return this.translate.instant(key);
  }


  public getDefaultLanguageCode(): string {
  let languageCode: any;
  if (this.cookieService.check(this.C_LANG)) {
    languageCode = this.cookieService.get(this.C_LANG);
  }
  else {
    languageCode = this.translate.getBrowserLang(); // which is same as: navigator.language;//  
  }
  languageCode = languageCode || this.systemService.system.dynamic.configuration.defaultLanguageCode;

  return languageCode;
  }
}
