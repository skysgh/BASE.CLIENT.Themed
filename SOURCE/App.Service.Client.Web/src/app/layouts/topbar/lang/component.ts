import { Observable, of } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from "@angular/core";

// Language
import { LanguageService } from '../../../../_BASE/shared/services/language.service';
import { SystemService } from "../../../../_BASE/shared/services/system.service";
import { DiagnosticsTraceService } from "../../../../_BASE/shared/services/diagnostics.service";
import { SystemLanguage } from '../../../../_BASE/shared/models/data/system-language.model';
import { System } from '../../../../_BASE/shared/constants/contracts/system';



@Component({
  selector: 'app-frame-context-language',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseLayoutTopBarContextLanguageComponent implements OnInit {


  system: System;

  public systemLanguages$: Observable<SystemLanguage[]> = of([]);

  // Language: stuff:
  flagvalue: string = '';
  valueset: string = '';
  languageTitle: string = '';
  cookieValue: any;
  constructor(
    systemService: SystemService,
    protected diagnosticsTraceService: DiagnosticsTraceService,
    public languageService: LanguageService,
    public translate: TranslateService,
    public _cookiesService: CookieService) {

    // Can be either via service, or injecting the constats/settings object:
    this.system = systemService.system;
  }

  ngOnInit(): void {
    this.initLanguages();

    }


  private initLanguages() {
    // This will take a sec to retrieve:
    this.languageService
      .items$
      .subscribe(x => {

        if (x.length == 0) {
          this.diagnosticsTraceService.info("...early exit...");
          return;
        }

        // Cookies wise Language set
        this.cookieValue = this._cookiesService.get('lang') || 'en';
        this.diagnosticsTraceService.info("cookie value:" + this.cookieValue);

        this.diagnosticsTraceService.info("...processing...");
        this.diagnosticsTraceService.info("Number of languages is:" + x.length);

        //Get an array of one, matching current language description:
        var tmp = x.filter(x => x.languageCode === this.cookieValue);

        if (tmp.length === 0) {
          // NO match, so can't set to a specific flag. Fallback:
          this.languageTitle = '...';
          this.valueset = this.system.sources.assets.images.flags + '/00.svg';
          this.flagvalue = this.system.sources.assets.images.flags + '/00.svg';
        } else {
          //tmp = tmp[0];
          // Match. So image will be ok.
          // And we can also set the language title.
          this.languageTitle = tmp[0].title;

          this.diagnosticsTraceService.info("languageTitle:" + this.languageTitle);
          // go through array of 1:
          // and get it's flag url:
          this.flagvalue = `${this.system.sources.assets.images.flags}${tmp[0].languageCode}.svg`;
        }
        this.diagnosticsTraceService.info("valueset:" + this.valueset);
        this.diagnosticsTraceService.info("FlagValue:" + this.flagvalue);

        this.systemLanguages$ = of(x);

      });

  }


  /***
 * Language Value Set
 */
  setLanguage(systemLanguage: SystemLanguage) {
    if (systemLanguage) {
      this.languageTitle = systemLanguage.title;
      this.flagvalue = `${this.system.sources.assets.images.flags}${systemLanguage.languageCode}.svg`;
      this.cookieValue = systemLanguage.languageCode ?? 'en';
      this.languageService.setLanguage(systemLanguage.languageCode ?? 'en');
    }
  }

  trackByCountryCode(index: number, item: SystemLanguage) {
    console.log(item.description);
    //this.diagnosticsTraceService.info(item.description);
    return item.languageCode;
  }

}
