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
import { LanguageService } from '../../../../../sites.app.parts/i18n/services/language.service';
import { LanguageViewModel } from '../../../../../sites.app.parts/i18n/models/language.view-model';
// Models:
import { ViewModel } from './vm';
import { TranslationService } from '../../../../../core/services/translation.service';

@Component({
    selector: 'app-base-common-components-topbar-languagelanguage',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
export class BaseCoreCommonComponentTopBarLanguageSelectorComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose parent configuration:
  public groupConfiguration = themesT1Configuration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  // Language: stuff:
  activeLanguageCode: string = '';
  flagvalue: string = '';
  languageTitle: string = '';

  constructor(
    private defaultControllerServices: DefaultComponentServices,
    public languageService: LanguageService,
    public translationService: TranslationService,
    public _cookiesService: CookieService
  ) {
    this.initLanguages();
  }

  // ✅ Get languages from signal-based service
  get languages(): LanguageViewModel[] {
    return this.languageService.languages();
  }

  ngOnInit(): void {
  }

  private initLanguages() {
    // Wait for languages to load, then set active language
    const checkLanguages = () => {
      const list = this.languageService.languages();
      if (list.length === 0) {
        // Languages not loaded yet, try again
        setTimeout(checkLanguages, 100);
        return;
      }

      this.defaultControllerServices.diagnosticsTraceService.info("Number of languages is:" + list.length);
      this.activeLanguageCode = this.translationService.getDefaultLanguageCode();

      // Get matching language using languageCode
      const tmp = list.filter(i => i.languageCode === this.activeLanguageCode);
      this.setLanguage(tmp.length ? tmp[0] : undefined, false);
    };

    checkLanguages();
  }

  /**
   * Language Value Set
   */
  setLanguage(language?: LanguageViewModel, setLang: boolean = true) {
    if (language) {
      this.languageTitle = language.name;
      // Use flagImageId for the flag image
      this.flagvalue = `${this.appsConfiguration.others.core.constants.assets.images.flags}${language.flagImageId}.svg`;

      if (setLang) {
        this.translationService.setLanguage(language.languageCode);
      }
      this.activeLanguageCode = language.languageCode;
    } else {
      this.languageTitle = '...';
      this.flagvalue = this.appsConfiguration.others.core.constants.assets.images.flags + '/00.svg';
    }
  }

  trackByCountryCode(index: number, item: LanguageViewModel) {
    return item.languageCode;
  }
}
