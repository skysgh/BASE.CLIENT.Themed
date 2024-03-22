import { Observable, BehaviorSubject, of, timer } from 'rxjs';
import { tap , map, switchMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { SystemLanguagesRepositoryService } from '../repositories/system.languages.repository.service';
import { DiagnosticsTraceService } from '../diagnostics.service';
import { MappedGenericRepositoryServiceBase } from '../repositories/base/mapped-generic-repository.service.base';

/*
abstract base class 
*/
@Injectable({ providedIn: 'root' })
export abstract class ItemsCollectionServiceBase<TDto, TKeyType, TVto> {

  protected _this: ItemsCollectionServiceBase<TDto, TKeyType, TVto>;
  protected _className:string;
  // based on knowing this:
  protected abstract pollDelayInSeconds: number;
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
  protected tmpItemKeys: TKeyType[] =[];

  // The key issue to keep in mind is that
  // front end components (eg: a topbar)
  // are depending on this service.
  // But its observable list is in turn waiting for
  // a repo to return results.
  // So it's a double observable if you will.
  constructor(
    protected diagnosticsTraceService: DiagnosticsTraceService ,
    public translate: TranslateService,
    //protected repositoryService: MappedGenericRepositoryServiceBase<TDto>
  ) {
    this._this = this;
    this._className = this.constructor.name;
    // Do NOT call setup Timer from the constructor of the super class
    // as the subclass has not yet registered injected properties (eg: services)
    // that it needed, but didn't need to pass to the constructor of the super.
  }

  protected init(): void {
    this.diagnosticsTraceService.verbose(`${this._className}.setupTimer(${this.pollDelayInSeconds})`)
    // Check if pollDelay is less than or equal to 30 seconds
    if (this.pollDelayInSeconds <= 30) {
      // If so, initialize items once and return
      this.diagnosticsTraceService.debug(`...once once though.`)
      this.developObservableArrays().subscribe();
      return;
    }
    // Otherwise, set up timer for call now and then periodic updates
    // of all lists:
    this.diagnosticsTraceService.debug(`...timer initiating...`)
    timer(0, this.pollDelayInSeconds * 1000).pipe(
      switchMap(() => {
        this.diagnosticsTraceService.debug(`${this._className}...back...`)
        return this.developObservableArrays();
      })).subscribe();
  }

  protected developObservableArrays(): Observable<TDto[]> {
    this.diagnosticsTraceService.verbose(`${this._className}.initializeObservableArrays()`);
    return this.developObservableArrays2().pipe(
      tap(items => {
        this.diagnosticsTraceService.verbose(`${this._className}.developObservableArrays`);
      })
    );
  }

  private developObservableArrays2(): Observable<TDto[]> {
    this.diagnosticsTraceService.verbose(`${this._className}.initializeObservableArrays()`)
    // Subscribe to future response from repo:
    return this.InvokeRepository()
      .pipe(
        // pack into BS:
        tap(items => {
          this.diagnosticsTraceService.debug(`${this._className}...(back) initializeObservableArrays...`)
          // I think tap allows one to use the results
          // without disturbing it somehow?
          this.itemsBS.next(items);
          // Map to TVto type we want to use:
          this.developMappedObservableArray(items);
          // Create array of key values from TVto
          this.developMappedObservableKeyArray(items);
          // Create subset array of TVto that match the provided condition:
          this.developFilteredMappedObservableKeyArray(items);
          // Create subset array of TVto that don't match the provided condition:
          this.developFilteredNotMappedObservableKeyArray(items);
          //QUESTION:
          //
          //Should I be calling on onInitComplete?

          //Is there a more elegant way than to redo this same mapping yet again?
          var tmp : TVto[] = items.map((x) => { return this.developMappedObject(x) });
          this.onInitComplete(tmp);
        })
      );
  }


  protected developMappedObservableArray(items: TDto[]): void {
    this.diagnosticsTraceService.verbose(`${this._className}.developMappedObservableArray()`)
    // Foreach item, we invoke the abstract method
    // the sub class will provide to
    // Map each item to the target type.
    // And pack into second array.
    //
    // TODO: QUESTION: why are we not pushing into the this.mappedItemsBS?
    //this.mappedItems$ = of(items.map(this.developMappedObject));
    // Would this not be better:
    this.itemsBS.next(items);
  }

  protected developMappedObservableKeyArray(items: TDto[]): void {
    this.diagnosticsTraceService.verbose(`${this._className}.developMappedObservableKeyArray()`)
    // We remap the source (wasteful,I know)
    // to filter out the keys from the target type
    // as oppossed tothe source type:
    const tmp: TKeyType[] =
      items
        //.map(this.developMappedObject)
        .map((x) => { return this.developMappedObject(x) })
        .map(mappedItem => (mappedItem as any)[this.itemKeyFieldName] as TKeyType)
        .filter((v): v is TKeyType => typeof (v) === 'string');

    //We pack the results into the the itemKeysBS backing the this.itemKeys$:
    this.itemKeysBS.next(tmp);

    //Tmp Save so we can reuse? Not keen on that...
    this.tmpItemKeys = tmp;
  }

  protected developFilteredMappedObservableKeyArray(items: TDto[]): void {
    this.diagnosticsTraceService.verbose(`${this._className}.developFilteredMappedObservableKeyArray()`)
    // TODO: Question: Not clear what we are doing here.
    // VERIFY: I think we are taking items, mapping them to TVto,
    // then filtering them according to the filter condition
    // provided by the subclass.
    // The end result, an array of TVtos, gets pushed on to BS,
    // Which is how this.filteredMappedItems$ gets set.
    // So far, so good.
    this.filteredMappedItemsBS.next(
      items
        //.map(this.developMappedObject)
        .map((x) => { return this.developMappedObject(x) })
        .filter(mappedItem => this.filterFor(mappedItem))
    );
  }
  protected developFilteredNotMappedObservableKeyArray(items: TDto[]): void {
    this.diagnosticsTraceService.verbose(`${this._className}.developFilteredNotMappedObservableKeyArray()`)

    // This is the same operation as the last one,
    // except that it is for all objects that don't meet the condition.
    this.filteredNotMappedItemsBS.next(
      items
        .map((x) => { return this.developMappedObject(x) })
        .filter(mappedItem => {return !(this.filterFor(mappedItem))})
    );
    this.diagnosticsTraceService.verbose(`${this._className}.developFilteredNotMappedObservableKeyArray()...survived`)
  }

 
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
  protected abstract onInitComplete(items: TVto[]): void;
}
