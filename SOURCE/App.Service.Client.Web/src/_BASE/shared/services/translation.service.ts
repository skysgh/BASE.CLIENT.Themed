import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { DiagnosticsTraceService } from './diagnostics.service';
import { SystemService } from './system.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class TranslationService {

  public constructor(
    private diagnosticsTraceService: DiagnosticsTraceService,
    private systemService: SystemService,
    private translate: TranslateService,
    private cookieService: CookieService,
) {
    
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
  protected initialiseTranslatorsCurrentLanguage() {
    let browserLang: any;
    if (this.cookieService.check('lang')) {
      browserLang = this.cookieService.get('lang');
    }
    else {
      browserLang = this.translate.getBrowserLang();
    }

    this.translate.use(browserLang);
  }

  public setLanguage(lang: string) {
    this.translate.use(lang);

    this.cookieService.set('lang', lang);
  }

}
