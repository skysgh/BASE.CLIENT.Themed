import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


/**
 * An implementation of TranslateLoader
 * that can be invoked from AppModule.
 * It's ability is to load resources from
 * not just one, but multiple json files,
 * (eg one from core, one from theme, one from app, etc.).
 *
 * The way it is later used is from AppModule:
 * \@NgModule({
 *   declarations: [
 *    // Components, Directives, Pipes developed in this Module.
 *   ],
 *   imports: [
 *     // Other modules here
 *     TranslateModule.forRoot({
 *       loader: {
 *         provide: TranslateLoader,
 *         useFactory: (http: HttpClient) => {
 *           return new MultiTranslateLoader(http, ['assets/core', 'assets/app']);
 *         },
 *         deps: [HttpClient],
 *       },
 *     }),
 *   ],
 *   bootstrap: [\/* Your root component *\/],
 * })
 * export class AppModule { }
 */
export class MultiTranslateLoader implements TranslateLoader {
  /**
   * Constructor
   * invoked from AppModule
   * @param http
   * @param paths
   */
  constructor(private http: HttpClient, private paths: string[]) { }

  /**
   * Load all the specified language files,
   * from the different locations,
   * and merge them together.
   * @param lang
   * @returns
   */
  getTranslation(lang: string): Observable<any> {
    // Load all the specified files
    const translationRequests = this.paths.map(path =>
      this.http.get(`${path}/${lang}.json`)
    );

    /**
     * Merge the translations from each file
     */
    return forkJoin(translationRequests).pipe(
      map(translations =>
        translations.reduce((acc, translation) => {
          return { ...acc, ...translation }; // Merge translations
        }, {})
      )
    );
  }
}
