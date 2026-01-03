// rx:
import { Subscription } from "rxjs";
// Ag:
import { Component, Input, OnDestroy, OnInit, Output, inject } from "@angular/core";
// Services:
import { SystemDiagnosticsTraceService } from "../../../../../core/services/system.diagnostics-trace.service";
import { ViewModel } from "./vm";
import { themesT1Configuration } from "../../../configuration/implementations/themes.t1.configuration";

/**
 * Sign Up/In Component
 * 
 * ✅ DECOUPLED: No cross-tier imports (appsConfiguration removed)
 */
@Component({
    selector: 'app-base-core-common-components-signupin',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
export class BaseCoreCommonComponentsSignUpInComponent implements OnInit, OnDestroy {
  private diagnostics = inject(SystemDiagnosticsTraceService);
  
  // Expose theme configuration:
  public themeConfiguration = themesT1Configuration;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  constructor() {
    this.diagnostics.debug(`${this.constructor.name}.constructor()`);
  }

  ngOnInit(): void {
    this.diagnostics.debug(`${this.constructor.name}.onInit()`);
  }

  ngOnDestroy(): void {
  }
}
