import { Observable, BehaviorSubject, of, timer } from 'rxjs';
import { tap , map, switchMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SystemDiagnosticsTraceService } from '../system.diagnostics-trace.service';
import { MappedItemsCollectionServiceBase } from './mapped-items-collection.service.base';

/*
abstract base class for
controller backing services to in turn invoke a
repository service.

In a component, use it as follows:
```
public myComponent :...{
  // Define an observable:
  public mydata$: Observable<MyModelVTO[]> = of([]);

  // Kick of request early, unless it needs input from template info
  // in which case wait for ngOnInit:
  constructor(...) {
    this.initMyList();
  }
  ...
  private initMyList() {
    this.myService (derived from this class)
      .items$
      .subscribe(list => {
        if (list.length == 0) {
          this.diagnosticsTraceService.warn("...early exit...");
          return;
        }
        this.myList$ = of(list)
      );
  }
```
*/
@Injectable({ providedIn: 'root' })
export abstract class SimpleItemsCollectionServiceBase<TDto, TKeyType>
  extends MappedItemsCollectionServiceBase<TDto, TKeyType, TDto>{ 
}
