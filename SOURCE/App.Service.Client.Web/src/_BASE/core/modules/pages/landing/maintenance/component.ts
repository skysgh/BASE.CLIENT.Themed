// Ag:
import { Component } from '@angular/core';
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
// Services:
import { SystemService } from '../../../../services/system.service';
import { DiagnosticsTraceService } from '../../../../services/diagnostics.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-base-core-pages-landing-maintenance',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Maintenance Component
 */
export class BaseCorePagesLandingMaintenanceComponent  {

  system = importedSystemConst;

  constructor(
    systemService: SystemService,
    private diagnosticsTraceService: DiagnosticsTraceService,
    public translate: TranslateService) {
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }


}
