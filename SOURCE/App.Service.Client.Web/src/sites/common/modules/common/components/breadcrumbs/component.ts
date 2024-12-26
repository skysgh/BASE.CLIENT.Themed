// Rx:
//
// Ag:
import { Component, OnInit, Input } from '@angular/core';
// Etc:
//
// Constants:
import { system as importedSystemConst } from '../../../../../../core/constants/system';
import { TranslateService } from '@ngx-translate/core';
import { SystemDiagnosticsTraceService } from '../../../../../../core/services/system.diagnostics-trace.service';
import { ViewModel } from './vm';
// Pipes:
import { BaseTranslatePipe } from '../../../../../../core.ui/pipes/basetranslate.pipe';
// Services:
//
// Models:
//
// Data:
//
@Component({
  selector: 'app-base-core-common-components-breadcrumbs',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

/**
 * Bread Crumbs Component
 */
export class BaseCoreCommonComponentsBreadcrumbsComponent implements OnInit {
  // Make system/env variables avaiable to view template:
  public system = importedSystemConst;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();
  // TODO: Move these variables into it.

  @Input() title: string | undefined;
  @Input() description: string | undefined;

  @Input()
  breadcrumbItems!: Array<{
    active?: boolean;
    label?: string;
  }>;

  constructor(translate: TranslateService,
    private diagnosticsTraceService: SystemDiagnosticsTraceService) {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor()`);
 }

  ngOnInit(): void {
    this.diagnosticsTraceService.debug(`${this.constructor.name}.ngOnInit()`);
}

}
