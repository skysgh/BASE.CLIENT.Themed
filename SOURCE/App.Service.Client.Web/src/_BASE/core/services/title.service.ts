// Rx:
//
// Ag:
//
import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
// Etc:
//
// Constants:
import { system as importedSystemConst } from '../constants/system';
// Services:
import { DiagnosticsTraceService } from "./diagnostics.service";
// Models:
//
// Data:
//

// Describe the service:
@Injectable({ providedIn: 'root' })

// Injectable service to describe current environment
export class TitleService {
  constructor(private diagnosticsTraceService: DiagnosticsTraceService, private title: Title) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
 
  }

  public set(text: string) :void {
    this.title.setTitle(text);
  }
}
