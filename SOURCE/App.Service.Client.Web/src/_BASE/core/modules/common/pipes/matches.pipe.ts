// Rx:
// Ag:
import { Pipe, PipeTransform } from '@angular/core';
// Etc:
// Constants:
import { system as importedSystemConst } from '../../../constants/system';
// Models:
// Data:

@Pipe({
  name: 'matches'
})
export class MatchesPipe implements PipeTransform {
  // make system/env config accessible by markup:
  public system = importedSystemConst;

  transform(items: any[]|null, propertyName: string, propertyValue: any): any[] |null{
    if (!items || !propertyName || propertyValue === undefined) {
      return items;
    }

    return items.filter(item => item[propertyName] === propertyValue);
  }
}
