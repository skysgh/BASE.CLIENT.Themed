// Ag:
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  selector: 'app-base-core-pages-landing-index-demos',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})


/**
 * Footer Component
 */
export class BaseAppsPagesLandingIndexDemosComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;
  sectionsInfo = importedSectionsInfo;

  showNavigationArrows: any;
  showNavigationIndicators: any;

  constructor(systemService: SystemService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    public translate: TranslateService) {
    // Make system/env variables avaiable to view template (via singleton or service):
    // this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }


  ngOnInit(): void {
  }

}
