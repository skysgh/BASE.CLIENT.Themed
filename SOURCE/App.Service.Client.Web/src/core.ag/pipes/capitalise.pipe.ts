import { Pipe, PipeTransform } from '@angular/core';


// Services:
import { SystemDefaultServices } from '../../core/services/system.default-services.service';
import { StringService } from '../../core/services/string.service';

/**
 * Pipe to captialise the first letter of a given string.
 *
 * Usage: `{{ 'hello world' | capitalize }}`
 */
@Pipe({
    name: 'capitalize',
    standalone: false
})
export class CapitalizePipe implements PipeTransform {

  /**
   * Constructor
   * @param stringService
   */
  constructor(private defaultServices: SystemDefaultServices, private stringService: StringService) {

  }

  /**
   * Implementation of the contract to transform the given
   * text into a capitalised version.
   * @param value
   * @returns
   */
  transform(value: string): string {
    return this.stringService.capitaliseSentences(value,' ');
  }
}
