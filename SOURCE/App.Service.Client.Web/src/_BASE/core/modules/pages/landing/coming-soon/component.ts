// Ag:
import { Component } from '@angular/core';
//
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
// Services
import { SystemService } from '../../../../services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../services/system.diagnostics-trace.service';

@Component({
  selector: 'app-base-core-pages-landing-coming-soon',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * ComingSoon Component
 */
export class BaseCorePagesLandingComingSoonComponent  {
  // Make system/env variables avaiable to view template:
  public system = importedSystemConst;

  constructor(systemService: SystemService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    public translate: TranslateService) {
    // Make system/env variables avaiable to view template:
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }


}
