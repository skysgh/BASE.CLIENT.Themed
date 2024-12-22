// Ag:
import { Component, Input, OnInit } from '@angular/core';
// Constants:
import { system as importedSystemConst } from '../../../../../constants/system';
// Pipes:
import { BaseTranslatePipe } from '../../../../common/pipes/basetranslate.pipe';
// Services:
import { SystemService } from '../../../../../services/system.service';
import { TranslateService } from '@ngx-translate/core';
import { SystemDiagnosticsTraceService } from '../../../../../services/system.diagnostics-trace.service';
import { ViewModel } from './vm';

@Component({
  selector: 'app-base-core-pages-information-terms',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseCorePagesInformationTermsComponent implements OnInit {
  // Make system/env variables avaiable to class & view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.


  // bread crumb items
  breadCrumbItems!: Array<{}>;

  @Input()
  public replacements :{ [key: string]: string }|undefined;

  constructor(
    systemService: SystemService,
    private diagnosticsTraceService:
      SystemDiagnosticsTraceService,
    translateService: TranslateService) {
    // Make system/env variables avaiable to class & view template:
    this.system = systemService.system;

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`)

    // Note that tokens are not wrapped in the {{...}}
    // that must be on to find them:
    // Does not work yet:
    //this.replacements=
    //{
    //  'system.title': this.system.title,
    //  'system.description': this.system.description,
    //  'system.dynamic.sponsor.title': this.system.dynamic.sponsor.title,
    //  'system.dynamic.developer.title': this.system.dynamic.developer.title,
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
