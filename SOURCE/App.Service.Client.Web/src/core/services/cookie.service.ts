import { Injectable } from "@angular/core";
import { SystemDefaultServices } from "./system.default-services.service";

import { CookieService as CS } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CookieService {

  /**
   * Constructor
   * @param defaultServices
   */
  constructor(private defaultServices: SystemDefaultServices, private cookieService: CS) {
    this.defaultServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`);
  }

  public get(key: string): string {
    return this.cookieService.get(key);
  };
  public getAll(key: string): { [key: string]: string; } {
    return this.cookieService.getAll();
  };
  public set(key: string, value: string, expires?: number | Date, path?: string | undefined, domain?: string | undefined, secure?: boolean | undefined): void {
    this.cookieService.set(key, value, expires, path, domain, secure);
  };
  public delete(key: string) : void{
    this.cookieService.delete(key);
  }
  public check(key: string): boolean {
    return this.cookieService.check(key);
  }


  public getCookieValue(key: string) {
    // Invoke static method:
    return CookieService.getCookieValue(key);
  }
  
  public static getCookieValue(key: string | undefined ) {

    var value: (string | undefined) = document.cookie
      .split(';')
      .map(cookie => cookie.trim())
      .find(cookie => cookie.startsWith(key + '='));

    if (value) {
      // Extract the language value after "key="
      value = value.substring(value.length + 1); // "lang=".length = 5
    }

    return value;
  }

}
