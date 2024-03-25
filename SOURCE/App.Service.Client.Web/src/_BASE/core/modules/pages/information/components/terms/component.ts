import { Component, Input, OnInit } from '@angular/core';
import { SystemService } from '../../../../../services/system.service';
import { System } from '../../../../../constants/contracts/system';
import { TranslateService } from '@ngx-translate/core';
import { DiagnosticsTraceService } from '../../../../../services/diagnostics.service';

@Component({
  selector: 'app-base-core-pages-information-terms',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCorePagesInformationTermsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  system: System;

  @Input()
  public replacements :{ [key: string]: string }|undefined;

  constructor(
    systemService: SystemService,
    private diagnosticsTraceService:
      DiagnosticsTraceService,
    translateService: TranslateService) {
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)

    // Note that tokens are not wrapped in the {{...}}
    // that must be on to find them:
    // Does not work yet:
    //this.replacements=
    //{
    //  'system.title': this.system.title,
    //  'system.description': this.system.description,
    //  'system.sponsor.title': this.system.sponsor.title,
    //  'system.developer.title': this.system.developer.title,
    //}

  }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`)

    // Configure breadcrumbs:
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Information' },
      { label: 'Term & Conditions', active: true }
    ];
  }
}
