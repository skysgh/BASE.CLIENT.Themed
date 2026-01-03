// Rx:
//
// Ag:
import { Component, OnInit, Input, inject } from '@angular/core';
// Configuration:
import { themesT1Configuration } from '../../configuration/implementations/themes.t1.configuration';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';
// Models:
import { ViewModel } from './vm';

@Component({
    selector: 'app-base-core-common-components-breadcrumbs',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})

/**
 * Bread Crumbs Component
 * 
 * ✅ DECOUPLED: No cross-tier imports (appsConfiguration removed)
 */
export class BaseCoreCommonComponentsBreadcrumbsComponent implements OnInit {
  private diagnostics = inject(SystemDiagnosticsTraceService);
  
  // Expose theme configuration:
  public themeConfiguration = themesT1Configuration;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  @Input() title: string | undefined;
  @Input() description: string | undefined;

  @Input()
  breadcrumbItems!: Array<{
    active?: boolean;
    label?: string;
  }>;

  constructor() {
    this.diagnostics.debug(`${this.constructor.name}.constructor()`);
  }

  ngOnInit(): void {
    this.diagnostics.debug(`${this.constructor.name}.ngOnInit()`);
  }
}
