import { Injectable } from "@angular/core";
import { SystemDefaultServices } from "./system.default-services.service";

/**
 * Service to manage the fetching and injecting
 * of external scripts into the application.
 */
@Injectable({
  providedIn: 'root',
})
export class ScriptService {


  constructor(private defaultServices: SystemDefaultServices) {
  }
  /**
   * Method to load scripts from a given url
   * (eg: 'https://maps.googleapis.com/maps/api)
   * // and inject it into the dom.
   * An example of using it from within a component might be
   * ngOnInit(): void {
   *  // Load a script into the <head>
   *  this.scriptService
   *    .loadScript('google-analytics', 'https://www.google-analytics.com/analytics.js', 'head')
   *    .then(() => {
   *      console.log('Google Analytics script loaded successfully!');
   *      // Initialise Google Analytics or related logic here if needed.
   *    })
   *    .catch((error) => {
   *      console.error('Failed to load Google Analytics script:', error);
   *    });
   *
   *  // Load a script into the <body>
   *  this.scriptService
   *    .loadScript('google-maps', 'https://maps.googleapis.com/maps/api/js', 'body')
   *    .then(() => {
   *      console.log('Google Maps script loaded successfully!');
   *      // Initialise Google Maps or related logic here if needed.
   *    })
   *    .catch((error) => {
   *      console.error('Failed to load Google Maps script:', error);
   *    });
   *}
   * 
  * @param id Unique identifier for the script tag.
   * @param src The URL of the script to load.
   * @param location 'head' or 'body', defaults to 'body'.
   * @returns A Promise that resolves when the script is loaded or rejects on failure.
   */
  loadScript(id: string, src: string, location: 'head' | 'body' = 'body'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById(id)) {
        console.log(`Script with ID "${id}" is already loaded.`);
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = id;
      script.src = src;
      script.type = 'text/javascript';
      script.async = true;

      script.onload = () => {
        console.log(`Script "${src}" loaded successfully.`);
        resolve();
      };
      script.onerror = () => {
        console.error(`Failed to load script "${src}".`);
        reject(new Error(`Script load error for ${src}`));
      };

      const target = location === 'head' ? document.head : document.body;
      target.appendChild(script);
    });
  }
}


