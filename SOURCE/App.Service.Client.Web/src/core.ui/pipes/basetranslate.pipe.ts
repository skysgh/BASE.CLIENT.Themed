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
  constructor(private translationService: TranslationService) { }

  /**
   * Transforms a given key into its translated value.
   * @param key The translation key to resolve.
   * @returns The fully resolved translation string.
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
