// Rx:
//
// Ag:
import { Pipe, PipeTransform } from '@angular/core';
// Etc:
// Constants:
import { system as importedSystemConst } from '../../../constants/system';
// Models:
// Data:

@Pipe({ name: 'enabled', pure: false })
export class EnabledPipe implements PipeTransform {
  // make system/env config accessible by markup:
  public system = importedSystemConst;

  transform(items: any[]): any {
    if (!items) {
      return items;
    }
    // Filter items array based on the condition
    return items.filter(item => item?.enabled==true);
  }
}
