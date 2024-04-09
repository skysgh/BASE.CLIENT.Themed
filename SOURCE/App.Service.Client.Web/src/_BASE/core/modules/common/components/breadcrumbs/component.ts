// Rx:
//
// Ag:
import { Component, OnInit, Input } from '@angular/core';
// Etc:
//
// Constants:
import { system as importedSystemConst } from '../../../../constants/system';
import { TranslateService } from '@ngx-translate/core';
import { SystemDiagnosticsTraceService } from '../../../../services/system.diagnostics-trace.service';
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
