import { Pipe, PipeTransform } from '@angular/core';

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
