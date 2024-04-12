// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../constants/system';
// Services:
import { SystemService } from '../../../../../../services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../../../services/system.diagnostics-trace.service';
// Data/Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';

@Component({
  selector: 'app-base-core-pages-landing-index-cta',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Cta Component
 */
export class BaseAppsPagesLandingIndexCtaComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;
  sectionsInfo = importedSectionsInfo;

  constructor(systemService: SystemService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    public translateService: TranslateService) {
    // Make system/env variables avaiable to class & view template:
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  } 

  ngOnInit(): void {
  }

}
