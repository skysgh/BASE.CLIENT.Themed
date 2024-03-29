// Ag:
import { Component } from '@angular/core';
// Misc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
// Services:
import { SystemService } from '../../../../services/system.service';
import { DiagnosticsTraceService } from '../../../../services/diagnostics.service';

@Component({
  selector: 'app-base-core-pages-landing-opportunities',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCorePagesLandingOpportunitiesComponent  {

  system = importedSystemConst;

  constructor(
    systemService: SystemService,
      private diagnosticsTraceService:
      DiagnosticsTraceService,
      public translate: TranslateService) {
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }

}
