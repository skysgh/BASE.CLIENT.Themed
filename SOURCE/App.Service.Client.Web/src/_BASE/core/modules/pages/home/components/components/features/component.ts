// Ag:
import { Component, OnInit } from '@angular/core';
// Translate:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../constants/system';
// Services:
import { SystemService } from '../../../../../../services/system.service';
import { DiagnosticsTraceService } from '../../../../../../services/diagnostics.service';

@Component({
  selector: 'app-base-core-pages-landing-index-designed',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Designed Component
 */
export class BaseAppsPagesLandingIndexDesignedComponent implements OnInit {

  system = importedSystemConst;

  constructor(systemService: SystemService,
    private diagnosticsTraceService: DiagnosticsTraceService,
    public translateService: TranslateService) {
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  } 

  ngOnInit(): void {
  }

}
