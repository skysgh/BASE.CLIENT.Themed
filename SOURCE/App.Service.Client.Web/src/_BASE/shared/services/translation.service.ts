import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { DiagnosticsTraceService } from './diagnostics.service';


@Injectable({ providedIn: 'root' })
export class TranslationService {

  public constructor(
    private diagnosticsTraceService :DiagnosticsTraceService,
    private translate: TranslateService,
    private cookieService: CookieService,
) {
    
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
