import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../core/services/translation.service';
//import { resolve } from 'path';

/**
 * Angular Pipe to translate a key and recursively resolve nested keys.
 */
@Pipe({
  name: 'baseTranslate',
  pure: false // Enables dynamic updates to translations
})
export class BaseTranslatePipe implements PipeTransform {
  private readonly MAX_DEPTH: number = 5;

  constructor(private translate: TranslateService, private translationService: TranslationService) { }

  /**
   * Transforms a given key into its translated value, resolving nested keys up to MAX_DEPTH.
   * @param key The translation key to resolve.
   * @returns The fully resolved translation string.
   */
  transform(key: string): string {
    if (!key) {
      return key;
    }

    return this.resolveKey(key, 0);
  }

  /**
   * Resolves a translation key and any nested keys recursively.
   * @param key The translation key to resolve.
   * @param depth The current recursion depth.
   * @returns The resolved translation string.
   */
  private resolveKey(key: string, depth: number): string {
    if (depth > this.MAX_DEPTH) {
      return key; // Stop recursion if max depth is exceeded
    }

    let translatedValue : string= this.translationService.instant(key);
    //translatedValue = translatedValue.split('//')[0].trim();

    //const pattern = /^(?!https?:\/\/.*)(.*?)(?=\/\/)/;
    //const pattern = /^(?!https?:[0-9]*\/\/)(.*?)(?=\/\/)/;
    const pattern = /^(.*?)(?<!https?:[0-9]*)\/\/.*$/;

    translatedValue = translatedValue.match(pattern) ? translatedValue.match(pattern)![1] : translatedValue;


    // If no nested keys, return the translated value
    if (!this.containsNestedKeys(translatedValue)) {
      return translatedValue || key; // Fallback to key if translation is missing
    }

    // Resolve nested keys in the translated value
    let resolvedValue : string = this.replaceNestedKeys(translatedValue, depth);

    resolvedValue = (resolvedValue == "[N/A]") ? `[@${key}]` : resolvedValue;
    resolvedValue = (resolvedValue == "") ? `@${key}` : resolvedValue;

    return resolvedValue;

  }

  /**
   * Checks if a string contains nested keys in the format {{ KEY }}.
   * @param value The string to check.
   * @returns True if nested keys are found, false otherwise.
   */
  private containsNestedKeys(value: string): boolean {
    return /\{\{(.*?)\}\}/.test(value);
  }

  /**
   * Replaces all nested keys in a string with their resolved translations.
   * @param value The string containing nested keys.
   * @param depth The current recursion depth.
   * @returns The string with nested keys replaced.
   */
  private replaceNestedKeys(value: string, depth: number): string {
    const tokenRegex = /\{\{(.*?)\}\}/g;

    return value.replace(tokenRegex, (_, nestedKey) => {
      const trimmedKey = nestedKey.trim();
      const resolvedNestedKey = this.resolveKey(trimmedKey, depth + 1);

      return resolvedNestedKey || `{{${trimmedKey}}}`; // Leave unresolved keys as-is
    });
  }
}
