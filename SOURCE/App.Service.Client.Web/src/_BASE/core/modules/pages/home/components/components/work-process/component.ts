// Ag:
import { Component, OnInit } from '@angular/core';
// Etc.
import { TranslateService } from '@ngx-translate/core';
// Models:
import {ProcessModel} from './process.model';
import { Process } from './data';
// Constants:
import { system as importedSystemConst } from '../../../../../../constants/system';
//
import { SystemService } from '../../../../../../services/system.service';
import { DiagnosticsTraceService } from '../../../../../../services/diagnostics.service';

@Component({
  selector: 'app-base-core-pages-landing-index-work-process',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * WorkProcess Component
 */
export class BaseAppsPagesLandingIndexWorkProcessComponent implements OnInit {

  system = importedSystemConst;

  Process!: ProcessModel[];
  
  constructor(systemService: SystemService,
    private diagnosticsTraceService: DiagnosticsTraceService,
    public translateService: TranslateService) {
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
