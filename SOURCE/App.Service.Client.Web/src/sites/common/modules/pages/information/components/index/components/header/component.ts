// Ag:
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
import { system as importedSystemConst } from '../../../../../../../../../core/constants/system';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../../../../../../core/services/system.diagnostics-trace.service';
// Data/Models:
//import { sectionsInfo as importedSectionsInfo } from '../../sectionsInfo.data';
import { SystemService } from '../../../../../../../../../core/services/system.service';


@Component({
  selector: 'app-base-core-information-index-header',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})


/**
 * Footer Component
 */
export class BaseAppsPagesLandingIndexHeaderComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;
  //sectionsInfo = importedSectionsInfo;

  // CHanging this (by the parent body div wrapper)
  // changes the style of the button.
  @Input()
  sectionId: string = '';// this.sectionsInfo.intro.id;


  // Event Emitter:
  //@Output()
  //sectionChanged: EventEmitter<string> = new EventEmitter<string>();

  
  
  constructor(systemService: SystemService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    public translate: TranslateService) {
    // Make system/env variables avaiable to view template (via singleton or service):
    // this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

    
  }


  ngOnInit(): void {
    // Noting?
  }






}
