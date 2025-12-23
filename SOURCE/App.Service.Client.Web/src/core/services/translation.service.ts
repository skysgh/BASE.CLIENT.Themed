// Rx:
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { Observable } from 'rxjs';
// Ag:
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Etc:
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
// Constants:
import { appsConfiguration } from '../../apps/configuration/implementations/apps.configuration';

// Services:
import { MultiTranslateLoader } from '../../core.ag/translations/MultiTranslateLoader';

import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
//import { SystemService } from './system.service';
import { SystemDefaultServices } from './system.default-services.service';
import { CookieService } from './cookie.service';


@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly MAX_DEPTH: number = 5;

  private C_LANG: string = appsConfiguration.others.core.constants.storage.cookies.lang;
  private previouslySetDefaultLanguage?: string;

  /**
   * Constructor.
   * @param diagnosticsTraceService
   * @param translateService
   * @param cookieService
   */
  constructor(
    //private defaultServices: SystemDefaultServices,
    //private systemService: SystemService,
    private cookieService: CookieService,
    // Still needed:
    private translateService: TranslateService
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

  private addLangs(languageCodes:string[]) : void {
    this.translateService.addLangs(languageCodes);
  }

  private innerUse(languageCode: string):Observable<any> {
    return this.translateService.use(languageCode);
  }

  private getBrowserLang(): string | undefined {
    return this.translateService.getBrowserLang();
  }

  private innerInstant(key:string) {
    return this.translateService.instant(key);
  }
  private innerGet(key: string) : Observable<any>{
    return this.translateService.get(key);
  }

  /**
   * Initialize the translator with available language codes.
   */
  public initializeTranslator(languageCodes: string[]): void {
    //this.defaultServices.diagnosticsTraceService.info("TranslationService.initializeTranslator(...)");
    this.addLangs(languageCodes);
    this.initialiseTranslatorsCurrentLanguage();
  }

  /**
   * Determine and set the default language for the translator.
   */
  public initialiseTranslatorsCurrentLanguage(): string {
    const languageCode = this.getDefaultLanguageCode();
    if (languageCode !== this.previouslySetDefaultLanguage) {
      this.innerUse(languageCode);
      this.previouslySetDefaultLanguage = languageCode;
      appsConfiguration.others.core.defaultLanguageCode = languageCode;
    }
    return languageCode;
  }

  /**
   * Get the default language code from a cookie or browser settings.
   */
  public getDefaultLanguageCode(): string {
    const languageCode = this.cookieService.check(this.C_LANG)
      ? this.cookieService.get(this.C_LANG)
      : this.getBrowserLang() || appsConfiguration.others.core.defaultLanguageCode;

    return languageCode;
  }

  /**
   * Change the current language.
   */
  public setLanguage(lang: string): void {
    this.innerUse(lang);
    this.cookieService.set(this.C_LANG, lang);
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

    let translatedValue: string = this.innerInstant(key);

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

    const translatedValue: string = await lastValueFrom(this.innerGet(key));

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
