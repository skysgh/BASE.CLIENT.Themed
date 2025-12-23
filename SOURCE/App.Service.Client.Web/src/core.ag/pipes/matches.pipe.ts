// Rx:
// Ag:
import { Pipe, PipeTransform } from '@angular/core';
// Etc:
// Constants:

// Models:
// Data:

/**
 * Pipe to filter items based on a given property name and value.
 *
 * Usage: `*ngFor="let item of items | matches:'propertyName':'propertyValue'"`
 */
@Pipe({
  name: 'matches'
})
export class MatchesPipe implements PipeTransform {

  transform(items: any[]|null, propertyName: string, propertyValue: any): any[] |null{
    if (!items || !propertyName || propertyValue === undefined) {
      return items;
    }

    return items.filter(item => item[propertyName] === propertyValue);
  }
}
