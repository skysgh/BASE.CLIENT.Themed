import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


/**
 * An implementation of TranslateLoader
 * that can be invoked from AppModule.
 * It's ability is to load resources from
 * not just one, but multiple json files,
 * (eg one from core, one from theme, one from app, etc.).
 *
 * ✅ FAULT-TOLERANT: If a file doesn't exist (404), it's skipped.
 * This allows tiers to have optional i18n files without breaking the app.
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
   * 
   * ✅ FAULT-TOLERANT: Skips missing files instead of failing
   * 
   * @param lang
   * @returns
   */
  getTranslation(lang: string): Observable<any> {
    // ✅ Remove trailing slash if present to avoid double slashes
    const cleanPaths = this.paths.map(path => 
      path.endsWith('/') ? path.slice(0, -1) : path
    );
    
    // Load all the specified files (with error handling)
    const translationRequests = cleanPaths.map(path =>
      this.http.get(`${path}/${lang}.json`).pipe(
        // ✅ If file doesn't exist (404), return empty object instead of error
        catchError(error => {
          console.warn(`[MultiTranslateLoader] Failed to load: ${path}/${lang}.json`, error.status);
          return of({});  // Return empty object, don't fail the entire load!
        })
      )
    );

    /**
     * Merge the translations from each file
     * ✅ Even if some files are missing, we merge what we got
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
