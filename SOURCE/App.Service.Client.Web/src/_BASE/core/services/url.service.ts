import { Injectable } from "@angular/core";
import { ignore } from "@automapper/core";
import { DiagnosticsTraceService } from "./diagnostics.service";


@Injectable({ providedIn: 'root' })
export class UrlService {

  constructor(private diagnosticsTraceService: DiagnosticsTraceService) {
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

}
