//import { Observable, BehaviorSubject, of } from 'rxjs';
//import { tap , map} from 'rxjs/operators';
//import { Injectable } from '@angular/core';
//import { TranslateService } from '@ngx-translate/core';
//import { CookieService } from 'ngx-cookie-service';
//import { SystemLanguagesRepositoryService } from '../repositories/system.languages.repository.service';
//import { SystemLanguage } from '../../models/data/system-languages';
//import { DiagnosticsService } from '../diagnostics.service';

//@Injectable({ providedIn: 'root' })
//export abstract class LanguageService<Type> {

//  //public languages: SystemLanguage[] = [];
//  //public itemKeys: string[] = [];

//  // needed:
//  protected itemsBS: BehaviorSubject<SystemLanguage[]> = new BehaviorSubject<SystemLanguage[]>([]);
//  // to build:
//  public items: Observable<SystemLanguage[]> = this.itemsBS.asObservable();
//  public itemKeys: Observable<any> = of ([]);

//  protected abstract keyFieldName:string; 

//  // The key issue to keep in mind is that
//  // front end components (eg: topbar)
//  // are depending on this service.
//  // But its observable list is in turn waiting for
//  // a repo to return results.
//  // So it's a double observable if you will.
//  constructor(
//    private diagnosticsTraceService: DiagnosticsService ,
//    public translate: TranslateService,
//    private cookieService: CookieService,
//    private systemLanguagesRepositoryService: SystemLanguagesRepositoryService,
//  ) {

//    this.initItems();

//    //this.GetList().subscribe(
//    //  x => {
//    //    this.languages = x;
//    //});


//  }


//  private initItems(): void {
//    // Subscribe to future response from repo:
//    this.systemLanguagesRepositoryService.getAllEnabled()
//      .pipe(
//        // pack into BS:
//        tap(i => { this.itemsBS.next(i); }),
//        // ?
//        map((i: Type[]) => { return i.map(di => di[this.keyFieldName]); })
//      )
//      // when done, persist into second observable:
//      .subscribe(sl => {

//        this.diagnosticsTraceService.info('..........');
//        //To pass, get rid of nulls:
//        var sl2:string[] = sl.filter((v): v is string => typeof (v) === 'string');
//        this.diagnosticsTraceService.info(sl2);
//        this.itemKeys = of(sl2);

//        // Ready to affect cha
//        this.OnListInitialised();
//      });
//  }

//  protected abstract OnListInitialised(): void;

//}
