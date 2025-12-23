import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';
//import { resolve } from 'path';

/**
 * Angular Pipe to translate a key
 * and recursively resolve nested keys.
 *
 * Important:
 * It's primary purpose is to isolate the
 * rest of the document from direct dependency
 * on a 3rd party library, especially one used
 * everywhere.
 *
 * It just so happens to also recursively
 * search for {{key}} within resources, which
 * makes it even useful than the default
 * bare bones `translate` pipe.
 */
@Pipe({
  name: 'baseTranslate',
  pure: false // Enables dynamic updates to translations
})
export class BaseTranslatePipe implements PipeTransform {
  constructor(private translationService: TranslationService) { }

  /**
   * Transforms a given key into its translated value.
   * @param key The translation key to resolve.
   * @returns The fully resolved translation string.
   *
   * Usage: `{{ 'key' | baseTranslate }}`
   */
  public transform(key: string): string {
    if (!key) {
      return key;
    }
    // Our service performs the recursive translation resolution:
    let value: string = this.translationService.instant(key);

    return (value === key)? key : value;
  }
}
