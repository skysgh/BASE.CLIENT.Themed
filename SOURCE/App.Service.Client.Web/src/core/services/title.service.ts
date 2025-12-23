// Rx:
//
// Ag:
//
import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
// Etc:
//
// Constants:
//
// Services:
import { SystemDiagnosticsTraceService } from "./system.diagnostics-trace.service";
import { SystemDefaultServices } from "./system.default-services.service";
// Models:
//
// Data:
//

// Describe the service:
@Injectable({ providedIn: 'root' })

// Injectable service to describe current environment
export class TitleService {

  constructor(
    private defaultServices: SystemDefaultServices,
    private title: Title) {

    this.defaultServices.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)
 
  }

  public set(text: string) :void {
    this.title.setTitle(text);
  }
}
