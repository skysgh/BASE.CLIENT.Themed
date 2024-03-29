// Ag:
import { Component, OnInit } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../constants/system';
// Services:
import { SystemService } from '../../../../../../services/system.service';
import { DiagnosticsTraceService } from '../../../../../../services/diagnostics.service';
// Data/Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';

@Component({
  selector: 'app-base-core-pages-landing-index-features',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Collection Component
 */
export class BaseAppsPagesLandingIndexFeaturesComponent implements OnInit {

  system = importedSystemConst;
  sectionsInfo = importedSectionsInfo;

  constructor(
    systemService: SystemService,
    private diagnosticsTraceService: DiagnosticsTraceService,
    public translateService: TranslateService) {
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }


  ngOnInit(): void {
  }

}
