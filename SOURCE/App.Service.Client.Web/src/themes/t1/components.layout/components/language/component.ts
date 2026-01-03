// Rx:
import { Observable, of } from 'rxjs';
// Ag:
import { Component, OnInit, inject } from "@angular/core";
// Etc:
import { CookieService } from 'ngx-cookie-service';
// Configurations:
import { themesT1Configuration } from '../../../configuration/implementations/themes.t1.configuration';
// Core constants:
import { coreConstants } from '../../../../../core/constants/implementations/core.constants';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../../core/services/system.diagnostics-trace.service';
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
/**
 * Language Selector Component
 * 
 * ✅ DECOUPLED: Uses coreConstants instead of appsConfiguration
 */
export class BaseCoreCommonComponentTopBarLanguageSelectorComponent implements OnInit {
  private diagnostics = inject(SystemDiagnosticsTraceService);
  
  // Expose theme configuration:
  public themeConfiguration = themesT1Configuration;
  
  // ✅ Expose core constants for template
  public coreConstants = coreConstants;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  // Language: stuff:
  activeLanguageCode: string = '';
  flagvalue: string = '';
  languageTitle: string = '';

  constructor(
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

      this.diagnostics.info("Number of languages is:" + list.length);
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
      // ✅ Use core constants for flag path (not appsConfiguration)
      this.flagvalue = `${coreConstants.assets.images.flags}${language.flagImageId}.svg`;

      if (setLang) {
        this.translationService.setLanguage(language.languageCode);
      }
      this.activeLanguageCode = language.languageCode;
    } else {
      this.languageTitle = '...';
      this.flagvalue = coreConstants.assets.images.flags + '/00.svg';
    }
  }

  trackByCountryCode(index: number, item: LanguageViewModel) {
    return item.languageCode;
  }
}
