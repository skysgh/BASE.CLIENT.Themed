// Ag:
import { Component, OnInit } from '@angular/core';
// Etc.
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../../../../core/constants/system';
// Services:
import { SystemService } from '../../../../../../../../../core/services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../../../../../../core/services/system.diagnostics-trace.service';
// Data/Models:
//import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';


@Component({
  selector: 'app-base-common-components-footer-ooo',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})


/**
 * Footer Component
 */
export class BaseAppsPagesLandingIndexFooterComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;
  //sectionsInfo = importedSectionsInfo;

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
