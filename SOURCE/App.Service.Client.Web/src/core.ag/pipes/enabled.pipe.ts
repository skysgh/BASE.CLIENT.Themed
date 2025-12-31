// Rx:
//
// Ag:
import { Pipe, PipeTransform } from '@angular/core';
// Etc:
// Models:
// Data:

/**
 * Pipe to filter items based on each items' `enabled`
 * property value.
 *
 * Usage: `*ngFor="let item of items | enabled"`
 */
@Pipe({
    name: 'enabled', pure: false,
    standalone: false
})
export class EnabledPipe implements PipeTransform {
  // make system/env config accessible by markup:

  transform(items: any[]): any {
    if (!items) {
      return items;
    }
    // Filter items array based on the condition
    return items.filter(item => item?.enabled==true);
  }
}
