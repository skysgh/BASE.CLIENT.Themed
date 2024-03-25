import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { DiagnosticsTraceService } from "./diagnostics.service";


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
