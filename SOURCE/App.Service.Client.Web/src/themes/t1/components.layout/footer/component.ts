// Rx:
import { Observable } from 'rxjs';
//
// Ag:
import { Component, OnInit, inject } from '@angular/core';
// Configuration:
import { themesT1Configuration } from '../../configuration/implementations/themes.t1.configuration';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';
import { AccountService } from '../../../../core/services/account.service';
// Models:
import { ViewModel } from './vm';

@Component({
    selector: 'app-footer',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
/**
 * ✅ MULTI-ACCOUNT: Uses AccountService for reactive branding
 * ✅ DECOUPLED: No cross-tier imports (appsConfiguration removed)
 */
export class BaseLayoutFooterComponent implements OnInit {
  private diagnostics = inject(SystemDiagnosticsTraceService);
  private accountService = inject(AccountService);

  // Expose theme configuration:
  public themeConfiguration = themesT1Configuration;

  // ✅ Account-aware branding (reactive)
  public logo$: Observable<string | undefined>;
  public appTitle$: Observable<string | undefined>;

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  constructor() {
    // ✅ Get branding from account config (reactive)
    this.logo$ = this.accountService.getConfigValue('branding.logo');
    this.appTitle$ = this.accountService.getConfigValue('name');
  }

  ngOnInit(): void {
  }
}
