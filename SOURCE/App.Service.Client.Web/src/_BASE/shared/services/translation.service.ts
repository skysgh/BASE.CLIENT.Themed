import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { DiagnosticsTraceService } from './diagnostics.service';
import { SystemService } from './system.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class TranslationService {

  // Hack: small chance they got to a 404 before they got anywhere:
  private previouslySetDefaultLanguage? : string;
  public constructor(
    private diagnosticsTraceService: DiagnosticsTraceService,
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
      this.systemService.system.sources.assets.i18n,
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

  public initialiseTranslatorsCurrentLanguage() {
    let languageCode: any;
    if (this.cookieService.check('lang')) {
      languageCode = this.cookieService.get('lang');
    }
    else {
      languageCode = this.translate.getBrowserLang();
    }
    if (languageCode != this.previouslySetDefaultLanguage) {
      this.translate.use(languageCode);
      this.previouslySetDefaultLanguage = languageCode;
      this.systemService.system.localisation.cultureCode = languageCode;
    }
  }

  public setLanguage(lang: string) {
    this.translate.use(lang);

    this.cookieService.set('lang', lang);
  }
  public instant(key: string): string {
    return this.translate.instant(key);
  }
}
