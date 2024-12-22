// Rx:
import { Observable, of } from 'rxjs';
// Ag:
import { Component, OnInit } from "@angular/core";
// Etc:
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
// Pipes:
import { BaseTranslatePipe } from '../../pipes/basetranslate.pipe';
// Language
import { ServiceLanguagesService } from '../../../../services/service.languages.service';
import { SystemService } from "../../../../services/system.service";
import { SystemDiagnosticsTraceService } from "../../../../services/system.diagnostics-trace.service";
import { ServiceLanguage } from '../../../../models/data/service-language.model';
import { TranslationService } from '../../../../services/translation.service';
import { ViewModel } from './vm';
// Models:


@Component({
  selector: 'app-base-common-components-topbar-languagelanguage',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentTopBarLanguageComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  public systemLanguages$: Observable<ServiceLanguage[]> = of([]);

  // Language: stuff:
  activeLanguageCode:string = '';
  flagvalue: string = '';
  //valueset: string = '';
  languageTitle: string = '';

  constructor(
    systemService: SystemService,
    protected diagnosticsTraceService: SystemDiagnosticsTraceService,
    public languageService: ServiceLanguagesService,
    public translate: TranslateService,
    public translationService: TranslationService,
    public _cookiesService: CookieService) {

    // Make system/env variables avaiable to view template (via singleton or service):
    // this.system = systemService.system;

    this.initLanguages();

  }

  ngOnInit(): void {

    }


  private initLanguages() {
    // This will take a sec to retrieve:
    this.languageService
      .items$
      .subscribe(list => {

        if (list.length == 0) {
          this.diagnosticsTraceService.info("...early exit...");
          return;
        }
        this.diagnosticsTraceService.info("Number of languages is:" + list.length);

        this.activeLanguageCode = this.translationService.getDefaultLanguageCode();
        // Cookies wise Language set

        //Get an array of one, matching current language description:
        var tmp = list.filter(i => i.languageCode === this.activeLanguageCode);

        this.setLanguage(tmp.length?tmp[0]:undefined, false);


        this.systemLanguages$ = of(list);

      });

  }


  /***
 * Language Value Set
 */
  setLanguage(systemLanguage?: ServiceLanguage, setLanguage:boolean=true) {
    // Same logic really, except for setting language.
    if (systemLanguage) {
      this.languageTitle = systemLanguage.title;
      this.flagvalue = `${this.system.sources.assets.public.static.default.images.flags}${systemLanguage.languageCode}.svg`;

      if (setLanguage) {
        this.translationService.setLanguage(systemLanguage.languageCode!);
      }
      this.activeLanguageCode = systemLanguage.languageCode;
    }else {
      this.languageTitle = '...';
      this.flagvalue = this.system.sources.assets.public.static.default.images.flags + '/00.svg';
    }
  }

  trackByCountryCode(index: number, item: ServiceLanguage) {
    //this.diagnosticsTraceService.info(item.description);
    return item.languageCode;
  }

}
