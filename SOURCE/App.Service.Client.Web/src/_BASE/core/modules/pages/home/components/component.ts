//import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
// Etc:
import { Component, OnInit } from '@angular/core';
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
// Services:
import { SystemService } from '../../../../services/system.service';
import { SystemDiagnosticsTraceService } from '../../../../services/system.diagnostics-trace.service';
// Data/Models:
import { sectionsInfo as importedSectionsInfo } from './sectionsInfo.data';

@Component({
  selector: 'app-apps-home-home',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsPagesInformationIndexComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  sectionId: string ='';

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  sectionsInfo = importedSectionsInfo;


  constructor(systemService: SystemService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService,
    translateService: TranslateService) {
    // Make system/env variables avaiable to class & view template:
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`)
  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)

    // Configure breadcrumbs:
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Home', active: true }
    ];
  }



  // Event handler for child event raised:
  // which wil be the outer div that has
  // appScrollspy behaviour that has been
  // added.
  onSectionChanged(sectionId: any) {
    this.sectionId = sectionId;
    // changes to this property
    // are pushed to the child header's
    // @input.
  }


}
