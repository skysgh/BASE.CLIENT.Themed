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
import { SystemDiagnosticsTraceService } from "./system.diagnostics-trace.service";
// Models:
//
// Data:
//

// Describe the service:
@Injectable({ providedIn: 'root' })

// Injectable service to describe current environment
export class TitleService {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;
  constructor(private diagnosticsTraceService: SystemDiagnosticsTraceService, private title: Title) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
 
  }

  public set(text: string) :void {
    this.title.setTitle(text);
  }
}
