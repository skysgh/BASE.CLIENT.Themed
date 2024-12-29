// Rx:
//
// Ag:
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Etc:
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
// Constants:
import { system as importedSystemConst } from '../constants/system';
// Services:
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
import { SystemService } from './system.service';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { Observable } from 'rxjs';
import { MultiTranslateLoader } from '../../sites/common/modules/translations/module';


@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly MAX_DEPTH: number = 5;

  public system = importedSystemConst;
  private C_LANG: string = 'lang';
  private previouslySetDefaultLanguage?: string;

  /**
   * Constructor.
   * @param diagnosticsTraceService
   * @param systemService
   * @param translateService
   * @param cookieService
   */
  constructor(
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    private systemService: SystemService,
    private translateService: TranslateService,
    private cookieService: CookieService
  ) { }

  /**
   * Expose the onLangChange event so subscribers can update the screen or other.
   */
  public onLangChange(): Observable<LangChangeEvent> {
    return this.translateService.onLangChange.asObservable();
  }


  /**
   * Creates a new TranslateHttpLoader instance to define paths for *.json files.
   */
  public static createTranslateLoader(http: HttpClient, paths:string[]): any {

    return new MultiTranslateLoader(http, paths);

  }

  /**
   * Initialize the translator with available language codes.
   */
  public initializeTranslator(languageCodes: string[]): void {
    this.diagnosticsTraceService.info("TranslationService.initializeTranslator(...)");
    this.translateService.addLangs(languageCodes);
    this.initialiseTranslatorsCurrentLanguage();
  }

  /**
   * Determine and set the default language for the translator.
   */
  public initialiseTranslatorsCurrentLanguage(): string {
    const languageCode = this.getDefaultLanguageCode();
    if (languageCode !== this.previouslySetDefaultLanguage) {
      this.translateService.use(languageCode);
      this.previouslySetDefaultLanguage = languageCode;
      this.systemService.system.dynamic.configuration.defaultLanguageCode = languageCode;
    }
    return languageCode;
  }

  /**
   * Get the default language code from a cookie or browser settings.
   */
  public getDefaultLanguageCode(): string {
    const languageCode = this.cookieService.check(this.C_LANG)
      ? this.cookieService.get(this.C_LANG)
      : this.translateService.getBrowserLang() || this.systemService.system.dynamic.configuration.defaultLanguageCode;

    return languageCode;
  }

  /**
   * Change the current language.
   */
  public setLanguage(lang: string): void {
    this.translateService.use(lang);
    this.cookieService.set('lang', lang);
  }

  /**
   * Instantly translate a key with recursive resolution for nested keys.
   */
  public instant(key: string): string {
    return this.resolveKeySynchronously(key, 0);
  }

  /**
   * Asynchronously translate a key with recursive resolution for nested keys.
   */
  public async get(key: string): Promise<string> {
    return this.resolveKeyAsynchronously(key, 0);
  }

  /**
   * Recursive key resolution (synchronous).
   */
  private resolveKeySynchronously(key: string, depth: number): string {
    if (depth > this.MAX_DEPTH) {
      return key; // Stop recursion if max depth is exceeded
    }

    let translatedValue: string = this.translateService.instant(key);

    const pattern = /^(.*?)(?<!https?:[0-9]*)\/\/.*$/;
    translatedValue = translatedValue.match(pattern) ? translatedValue.match(pattern)![1] : translatedValue;

    if (!this.containsNestedKeys(translatedValue)) {
      return translatedValue || this.makeReplacementToken(key)// key; // Return the translation or fallback to the key
    }

    return this.replaceNestedKeysSynchronously(translatedValue, depth);
  }

  /**
   * Recursive key resolution (asynchronous).
   */
  private async resolveKeyAsynchronously(key: string, depth: number): Promise<string> {
    if (depth > this.MAX_DEPTH) {
      return key; // Stop recursion if max depth is exceeded
    }

    const translatedValue: string = await lastValueFrom(this.translateService.get(key));

    const pattern = /^(.*?)(?<!https?:[0-9]*)\/\/.*$/;
    const cleanedValue = translatedValue.match(pattern) ? translatedValue.match(pattern)![1] : translatedValue;

    if (!this.containsNestedKeys(cleanedValue)) {
      return cleanedValue || this.makeReplacementToken(key); // Return the translation or fallback to the key
    }

    return this.replaceNestedKeysAsynchronously(cleanedValue, depth);
  }

  /**
   * Replace nested keys (synchronous).
   */
  private replaceNestedKeysSynchronously(value: string, depth: number): string {
    const tokenRegex = /\{\{(.*?)\}\}/g;

    return value.replace(tokenRegex, (_, nestedKey) => {
      const trimmedKey = nestedKey.trim();
      return this.resolveKeySynchronously(trimmedKey, depth + 1);
    });
  }

  /**
   * Replace nested keys (asynchronous).
   */
  private async replaceNestedKeysAsynchronously(value: string, depth: number): Promise<string> {
    const tokenRegex = /\{\{(.*?)\}\}/g;
    const matches = [...value.matchAll(tokenRegex)];

    for (const match of matches) {
      const nestedKey = match[1].trim();
      const resolvedValue = await this.resolveKeyAsynchronously(nestedKey, depth + 1);
      value = value.replace(match[0], resolvedValue || `{{${nestedKey}}}`);
    }

    return value;
  }

  /**
   * Check if a string contains nested keys (e.g., {{ KEY }}).
   */
  private containsNestedKeys(value: string): boolean {
    return /\{\{(.*?)\}\}/.test(value);
  }

  private makeReplacementToken(key:string): string {
    return `[${ key.toLowerCase() }]`
  }
}
