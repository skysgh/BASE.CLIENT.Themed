// Rx:
import { Observable, of } from 'rxjs';
// Ag:
import { Component, OnInit } from "@angular/core";
// Etc:
import { CookieService } from 'ngx-cookie-service';
// Configurations:
import { appsConfiguration } from '../../../../../sites.app/configuration/implementations/apps.configuration';
import { themesT1Configuration } from '../../../configuration/implementations/themes.t1.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../core/services/default-controller-services';
import { ServiceLanguagesService } from '../../../../../core/services/service.languages.service';
import { ServiceLanguage } from '../../../../../core/models/data/service-language.model';
// Models:
import { ViewModel } from './vm';
import { TranslationService } from '../../../../../core/services/translation.service';
// Data:


@Component({
  selector: 'app-base-common-components-topbar-languagelanguage',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCoreCommonComponentTopBarLanguageSelectorComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration


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
    private defaultControllerServices: DefaultComponentServices,
    public languageService: ServiceLanguagesService,
    public translationService: TranslationService,
    public _cookiesService: CookieService) {

    // Make system/env variables .avaiable to view template (via singleton or service):
    

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
          this.defaultControllerServices.diagnosticsTraceService.info("...early exit...");
          return;
        }
        this.defaultControllerServices.diagnosticsTraceService.info("Number of languages is:" + list.length);

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
      this.flagvalue = `${this.appsConfiguration.others.core.constants.assets.images.flags}${systemLanguage.languageCode}.svg`;

      if (setLanguage) {
        this.translationService.setLanguage(systemLanguage.languageCode!);
      }
      this.activeLanguageCode = systemLanguage.languageCode;
    }else {
      this.languageTitle = '...';
      this.flagvalue = this.appsConfiguration.others.core.constants.assets.images.flags + '/00.svg';
    }
  }

  trackByCountryCode(index: number, item: ServiceLanguage) {
    //this.diagnosticsTraceService.info(item.description);
    return item.languageCode;
  }

}
