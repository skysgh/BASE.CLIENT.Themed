// Rx:
//
// Ag:
import { Injectable } from '@angular/core';
// Etc:
//
// Constants:
import { system as importedSystemConst } from '../constants/system';
// Services:
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
// Models:
//
// Data:
//
@Injectable({
    providedIn: 'root',
})
export class PaginationService {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  pageSize: any = 8;
    page: any = 1;
    direction: any = 'asc';
    startIndex: number = 1;
    endIndex: number = 9;

  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`);
  }
    // Pagination
    changePage(alldata: any[]) {

      this.diagnosticsTraceService.debug(`${this.constructor.name}.changePage(allData)`);

      const startItem = (this.page - 1) * this.pageSize + 1;
        const endItem = (this.page - 1) * this.pageSize + this.pageSize;
        this.endIndex = endItem;
        if (this.endIndex > alldata.length) {
            this.endIndex = alldata.length;
        }
        return alldata.slice(startItem - 1, endItem);
    }

    // Sort Data
    onSort(column: any, dataList: any[]) {
      this.diagnosticsTraceService.debug(`${this.constructor.name}.onSort(column, dataList)`);

      if (this.direction == 'asc') {
            this.direction = 'desc';
        } else {
            this.direction = 'asc';
        }
        const sortedArray = [...dataList]; // Create a new array
        sortedArray.sort((a, b) => {
            const res = this.compare(a[column], b[column]);
            return this.direction === 'asc' ? res : -res;
        });
        return dataList = sortedArray;
    }
    compare(v1: string | number, v2: string | number) {
      this.diagnosticsTraceService.debug(`${this.constructor.name}.compare()`);
        return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
    }


}
