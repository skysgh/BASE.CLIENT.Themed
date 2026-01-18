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
   * ✅ DEEP MERGE: Later files extend (not replace) earlier ones
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
     * ✅ Uses DEEP MERGE so nested keys are extended, not replaced
     */
    return forkJoin(translationRequests).pipe(
      map(translations =>
        translations.reduce((acc, translation) => {
          return this.deepMerge(acc, translation);
        }, {})
      )
    );
  }

  /**
   * Deep merge two objects.
   * Properties from source override target, but nested objects are merged recursively.
   * This ensures that adding BASE.SETTINGS in sites.app doesn't wipe out BASE.HOMES from core.
   */
  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        // If both target and source have an object at this key, merge recursively
        if (target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])) {
          result[key] = this.deepMerge(target[key], source[key]);
        } else {
          // Source has object, target doesn't - use source
          result[key] = { ...source[key] };
        }
      } else {
        // Primitive value or array - source overwrites target
        result[key] = source[key];
      }
    }
    
    return result;
  }
}
