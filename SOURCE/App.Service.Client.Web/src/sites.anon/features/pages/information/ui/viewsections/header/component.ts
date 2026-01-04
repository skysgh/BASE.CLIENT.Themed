// Ag:
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// Etc:
import { TranslateService } from '@ngx-translate/core';
// Constants:
//
// Services:
import { SystemDiagnosticsTraceService } from '../../../../../../../core/services/system.diagnostics-trace.service';
// Data/Models:
import { appsConfiguration } from '../../../../../../../sites.app/configuration/implementations/apps.configuration';
import { TranslationService } from '../../../../../../../core/services/translation.service';


@Component({
    selector: 'app-base-core-information-index-header',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})


/**
 * Footer Component
 */
export class BaseAppsPagesLandingIndexHeaderComponent implements OnInit {

  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  //// Expose parent configuration:
  //public groupConfiguration = sitesConfiguration

  //sectionsInfo = importedSectionsInfo;

  // CHanging this (by the parent body div wrapper)
  // changes the style of the button.
  @Input()
  sectionId: string = '';// this.sectionsInfo.intro.id;

  //var t = appsConfiguration.constants.resources.open.images.logos

  // Event Emitter:
  //@Output()
  //sectionChanged: EventEmitter<string> = new EventEmitter<string>();

  
  
  constructor(
    //systemService: SystemService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    public translationService: TranslationService) {
    // Make system/env variables avaiable to view template (via singleton or service):
    

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)

    
  }


  ngOnInit(): void {
    // Noting?
  }






}
