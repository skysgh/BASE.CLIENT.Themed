// Rx:
//
// Ag:
import { Injectable } from "@angular/core";
// Etc:
import { ignore } from "@automapper/core";
// Constants:
import { system as importedSystemConst } from '../constants/system';
// Services:
import { SystemDiagnosticsTraceService } from "./system.diagnostics-trace.service";
import { IHasStringKeyValue } from "../models/contracts/IHasStringKeyValue";
// Models:
//
// Data:
//

@Injectable({ providedIn: 'root' })
export class UrlService {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)

  }

  public buildPageUrl(...parts: string[]): string {
    return this.buildUrl(true, ...parts);
  }

  public buildDirectoryUrl(...parts: string[]): string {
    return this.buildUrl(false, ...parts);
  }


  public buildUrl(isPage: boolean=false, ...parts: string[]): string {
    var result: string[] = [];
    for (var i = 0; i < parts.length; i++) {
      var part: string = parts[i].trim();

      if (part.length == 0) {
        continue;
      }
      if (part.substring(- 1) == '/') {
        result.push(part.substring(0, part.length - 1));
      } else {
        result.push(part);
      }
    }
    return result.join('/') + isPage?'':'/';
  }

  public buildUpUrl(baseurl: string, suffix?: string, queryArgs?: string): string {
    let url = baseurl;

    // Append suffix if provided
    if (suffix !== undefined && suffix !== null) {
      if (!suffix.startsWith('/')) {
        url += '/';
      }
      if (url.endsWith('/')) {
        url += suffix.substring(1);
      } else {
        url += suffix;
      }
    }

    // Append query args if provided
    if (queryArgs !== undefined && queryArgs !== null) {
      if (!queryArgs.startsWith('?')) {
        if (url.indexOf('?') === -1) {
          url += '?';
        } else {
          url += '&';
        }
      }
      url += queryArgs;
    }

    return url;
  }


  /**
   * Helper method to associate key/values modifiers
   * to given resource url.
   * 
   * Adds `?` and/or `&` divider characters as required.
   *
   * 
   * @param url
   * @param queryArgs
   * @returns
   */
  public appendQueryArgs(url: string, queryArgs: IHasStringKeyValue[] | null, matchChar:string='='): string {

    // Append query args if provided
    if (queryArgs == undefined || queryArgs == null || queryArgs?.length == 0) {
      return url;
    }
    let result = url;
    //TODO: there is a small option that items have been added before, in which case it would be &
    const pos = result.indexOf('?');

    let divider: string =
      (pos == -1)
        ? '?'
        : (pos == result.length - 1) ? '' : '&';

    for (let x of queryArgs) {
      result += `${divider}${x.key}${matchChar}${x.value}`;
      divider = '&';
    }
    return result;
  }

}
