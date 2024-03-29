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
import { DiagnosticsTraceService } from '../../../../services/diagnostics.service';

@Component({
  selector: 'app-base-core-pages-landing-coming-soon',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * ComingSoon Component
 */
export class BaseCorePagesLandingComingSoonComponent  {

  system = importedSystemConst;

  constructor(systemService: SystemService,
    private diagnosticsTraceService: DiagnosticsTraceService,
    public translate: TranslateService) {
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)
  }


}
