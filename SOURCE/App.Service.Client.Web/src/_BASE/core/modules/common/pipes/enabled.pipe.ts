import { Pipe, PipeTransform } from '@angular/core';



@Pipe({ name: 'enabled', pure: false })
export class EnabledPipe implements PipeTransform {
  transform(items: any[]): any {
    if (!items) {
      return items;
    }
    // Filter items array based on the condition
    return items.filter(item => item?.enabled==true);
  }
}
