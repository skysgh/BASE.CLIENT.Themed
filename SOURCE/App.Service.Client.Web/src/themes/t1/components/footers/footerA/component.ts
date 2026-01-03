// Rx:
// Ag:
import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
// Configuration:
import { themesT1Configuration } from '../../../configuration/implementations/themes.t1.configuration';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../../core/services/system.diagnostics-trace.service';
import { AccountService } from '../../../../../core/services/account.service';
// Models:
import { ViewModel } from './vm';

@Component({
    selector: 'app-base-common-components-footer-a',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
/**
 * Footer A Component
 * 
 * ✅ DECOUPLED: Uses AccountService for branding
 */
export class BaseCoreCommonComponentsFooterAComponent implements OnInit {
  private diagnostics = inject(SystemDiagnosticsTraceService);
  private accountService = inject(AccountService);
  
  // Expose theme configuration:
  public themeConfiguration = themesT1Configuration;

  // ✅ Account-aware branding (reactive)
  public appTitle$: Observable<string | undefined>;
  public developerTitle$: Observable<string | undefined>;
  
  // Static copyright year
  public copyrightYear = new Date().getFullYear();

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  constructor() {
    this.diagnostics.debug(`${this.constructor.name}.constructor()`);
    
    // ✅ Get branding from account config (reactive)
    this.appTitle$ = this.accountService.getConfigValue('name');
    this.developerTitle$ = this.accountService.getConfigValue('context.developer.title');
  }

  ngOnInit(): void {
    this.diagnostics.debug(`${this.constructor.name}.ngOnInit()`);
  }
}
