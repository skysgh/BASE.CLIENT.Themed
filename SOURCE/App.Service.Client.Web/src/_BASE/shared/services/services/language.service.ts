import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap , map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { SystemLanguagesRepositoryService } from '../repositories/system.languages.repository.service';
import { SystemLanguage } from '../../models/system-languages';
import { DiagnosticsService } from '../diagnostics.service';

@Injectable({ providedIn: 'root' })
export class LanguageService {

  //public languages: SystemLanguage[] = [];
  //public languageCodes: string[] = [];

  // needed:
  private languageDescriptionBS: BehaviorSubject<SystemLanguage[]> = new BehaviorSubject<SystemLanguage[]>([]);
  // to build:
  public languageDescriptions: Observable<SystemLanguage[]> = this.languageDescriptionBS.asObservable();
  public languageCodes: Observable<any> = of ([]);

  // The key issue to keep in mind is that
  // front end components (eg: topbar)
  // are depending on this service.
  // But its observable list is in turn waiting for
  // a repo to return results.
  // So it's a double observable if you will.
  constructor(
    private diagnosticsTraceService: DiagnosticsService ,
    public translate: TranslateService,
    private cookieService: CookieService,
    private systemLanguagesRepositoryService: SystemLanguagesRepositoryService,
  ) {

    this.initItems();

    //this.GetList().subscribe(
    //  x => {
    //    this.languages = x;
    //});


  }


  private initItems(): void {
    // Subscribe to future response from repo:
    this.systemLanguagesRepositoryService.getAllEnabled()
      .pipe(
        // pack into BS:
        tap(i => { this.languageDescriptionBS.next(i); }),
        // ?
        map((i: SystemLanguage[]) => { return i.map(di => di.languageCode); })
      )
      // when done, persist into second observable:
      .subscribe(sl => {

        this.diagnosticsTraceService.info('..........');
        //To pass, get rid of nulls:
        var sl2:string[] = sl.filter((v): v is string => typeof (v) === 'string');
        this.diagnosticsTraceService.info(sl2);
        this.languageCodes = of(sl2);

        // ready to invoke this method
        this.initLanguages(sl2);
      });
  }

  // Not sure who calls this:
  initLanguages(languageCodes:string[]) : void{
    let browserLang: any;
    /***
     * cookie Language Get
    */
    this.translate.addLangs(languageCodes);
    if (this.cookieService.check('lang')) {
      browserLang = this.cookieService.get('lang');
    }
    else {
      browserLang = this.translate.getBrowserLang();
    }

    this.translate.use(browserLang);

  }

  /***
 * Cookie Language set
 */
  public setLanguage(lang: any) {
    this.translate.use(lang);
    this.cookieService.set('lang', lang);
  }

}
