import { Observable, BehaviorSubject, of, timer } from 'rxjs';
import { tap , map, switchMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { SystemLanguagesRepositoryService } from '../repositories/system.languages.repository.service';
import { DiagnosticsTraceService } from '../diagnostics.service';
import { GenericRepositoryServiceBase } from '../repositories/base/generic-repository.service.base';

/*
abstract base class 
*/
@Injectable({ providedIn: 'root' })
export abstract class ItemsCollectionServiceBase<TDto, TKeyType, TVto> {

  // based on knowing this:
  protected pollDelayInSeconds: number = 0;
  protected abstract itemKeyFieldName: string;
  /**
   * Used to check that the response is not ridiculously large.
   */
  protected maxItems : number = 100;

  // needed:
  protected itemsBS: BehaviorSubject<TDto[]> = new BehaviorSubject<TDto[]>([]);
  protected itemKeysBS: BehaviorSubject<TKeyType[]> = new BehaviorSubject<TKeyType[]>([]);
  protected mappedItemsBS: BehaviorSubject<TVto[]> = new BehaviorSubject<TVto[]>([]);
  protected filteredMappedItemsBS: BehaviorSubject<TVto[]> = new BehaviorSubject<TVto[]>([]);
  protected filteredNotMappedItemsBS: BehaviorSubject<TVto[]> = new BehaviorSubject<TVto[]>([]);

  // to build these observables:
  public items$: Observable<TDto[]> = this.itemsBS.asObservable();
  public itemKeys$: Observable<TKeyType[]> = this.itemKeysBS.asObservable();
  public mappedItems$: Observable<TVto[]> = this.mappedItemsBS.asObservable();
  public filteredMappedItems$: Observable<TVto[]> = this.filteredMappedItemsBS.asObservable();
  public filteredNotMappedItems$: Observable<TVto[]> = this.filteredNotMappedItemsBS.asObservable();
  //public filteredMappedItems$: Observable<TVto[]> = of([]);

  // tmp to pass between args so we don't have to refilter:
  protected itemKeys: TKeyType[] =[];

  // The key issue to keep in mind is that
  // front end components (eg: a topbar)
  // are depending on this service.
  // But its observable list is in turn waiting for
  // a repo to return results.
  // So it's a double observable if you will.
  constructor(
    protected diagnosticsTraceService: DiagnosticsTraceService ,
    public translate: TranslateService,
    //protected repositoryService: GenericRepositoryServiceBase<TDto>
  ) {

  }

  protected setupTimer(): void {
    // Check if pollDelay is less than or equal to 30 seconds
    if (this.pollDelayInSeconds <= 30) {
      // If so, initialize items once and return
      this.initializeObservableArrays().subscribe();
      return;
    }
    // Otherwise, set up timer for call now and then periodic updates
    // of all lists:
    timer(0, this.pollDelayInSeconds * 1000).pipe(
      switchMap(() => this.initializeObservableArrays())).subscribe();
  }

  protected initializeObservableArrays(): Observable<TDto[]> {
    return this.initializeObservableArrays2().pipe(
      tap(items => {
        this.handleUpdate(items);
      })
    );
  }

  private initializeObservableArrays2(): Observable<TDto[]> {
    // Subscribe to future response from repo:
    return this.InvokeRepository()
      .pipe(
        // pack into BS:
        tap(items => {
          // I think tap allows one to use the results
          // without disturbing it somehow?
          this.itemsBS.next(items);
          // Map to type we want to use:
          this.developMappedObservableArray(items);
          // Create array of key values
          this.developMappedObservableKeyArray(items);
          // Create subset array of same type: 
          this.developFilteredMappedObservableKeyArray(items);
          // Create subset array of same type: 
          this.developFilteredNotMappedObservableKeyArray(items);
        })
      );
  }


  protected developMappedObservableArray(items: TDto[]): void {
    // Filtered arrays based on type
    // just psuedo example:
    this.mappedItems$ = of(items.map(this.developMappedObject));
  }

  protected developMappedObservableKeyArray(items: TDto[]): void {
    const tmp: TKeyType[] =
      items
        .map(this.developMappedObject)
        .map(mappedItem => (mappedItem as any)[this.itemKeyFieldName] as TKeyType)
        .filter((v): v is TKeyType => typeof (v) === 'string');
    this.itemKeysBS.next(tmp);
    this.itemKeys = tmp;
  }

  protected developFilteredMappedObservableKeyArray(items: TDto[]): void {
    this.filteredMappedItemsBS.next(
      items
        .map(this.developMappedObject)
        .filter(mappedItem => this.filterFor(mappedItem))
    );
  }
  protected developFilteredNotMappedObservableKeyArray(items: TDto[]): void {
  //  this.filteredMappedItemsBS.next(
  //    items
  //      .map(this.developMappedObject)
  //      .filter(mappedItem => this.filterFor((item: tVto) => { return !this.mappedItem(item); }))
  //  );
  }

  //protected developFilteredMappedArrays(items: TDto[]) {
  //  // Filtered arrays based on type
  //  // just psuedo example:
  //  // HOW do we map after we have filtered?
  //  this.filteredMappedItems$ = of(items.filter(x => this.filterFor).map(this.developMappedObject));
  //}

  /**
   * Abstract method to filter on TVtos.
   * @param item
   */
  protected abstract filterFor(item: TVto): boolean;

  /**
   * Abstract method to map TDto to TVto.
   * In many cases it just be a simple case of
   * TDto being the same as TVto,
   * in which case it's a simple case of
   * "return item";
   * @param item
   */
  protected abstract developMappedObject(item: TDto): TVto;

  /**
   * Abstract method to invoke the repositoryservice
   * method of choice to return an array of TDtos
   */
  protected abstract InvokeRepository(): Observable<TDto[]>;

  /**
   * Abstract final method for any action
   * required at the end of the refreshment of the list
   */
  protected handleUpdate(items: TDto[]): void {

  }
}
