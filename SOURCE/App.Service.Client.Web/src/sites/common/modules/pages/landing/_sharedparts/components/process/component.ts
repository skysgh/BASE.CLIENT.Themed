// Ag:
import { Component, OnInit } from '@angular/core';
// Etc.
import { TranslateService } from '@ngx-translate/core';
// Models:
import {ProcessModel} from './process.model';
import { Process } from './data';
// Constants:
import { system as importedSystemConst } from '../../../../../../../../core/constants/system';
// Pipes:
import { BaseTranslatePipe } from '../../../../../../../../core.ui/pipes/basetranslate.pipe';
// Services:
import { SystemService } from '../../../../../../../../core/services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../../../../../core/services/system.diagnostics-trace.service';
// Data/Models:
import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-pages-landing-index-work-process',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * WorkProcess Component
 */
export class BaseAppsPagesLandingIndexWorkProcessComponent implements OnInit {
  // Make system/env variables avaiable to view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  sectionsInfo = importedSectionsInfo;

  Process!: ProcessModel[];
  
  constructor(systemService: SystemService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    public translateService: TranslateService) {
    // Make system/env variables avaiable to view template:
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  } 

  ngOnInit(): void {
    /**
     * fetches data
     */
     this._fetchData();
  }

  /**
 * User grid data fetches
 */
   private _fetchData() {
    this.Process = Process;
  }

}
