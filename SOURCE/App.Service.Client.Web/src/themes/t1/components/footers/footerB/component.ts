// Rx:
import { Observable } from 'rxjs';
// Ag:
import { Component, OnInit, inject } from '@angular/core';
// Configuration:
import { themesT1Configuration } from '../../../configuration/implementations/themes.t1.configuration';
// Services:
import { SystemDiagnosticsTraceService } from '../../../../../core/services/system.diagnostics-trace.service';
import { AccountService } from '../../../../../core/services/account.service';
// Models:
import { ViewModel } from './vm';

@Component({
    selector: 'app-base-common-components-footer-b',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
/**
 * Footer B Component
 * 
 * ✅ DECOUPLED: Uses AccountService for reactive branding
 */
export class BaseCoreCommonComponentsFooterBComponent implements OnInit {
  private diagnostics = inject(SystemDiagnosticsTraceService);
  private accountService = inject(AccountService);
  
  // Expose theme configuration:
  public themeConfiguration = themesT1Configuration;

  // ✅ Account-aware branding (reactive)
  public sponsorTitle$: Observable<string | undefined>;
  public developerTitle$: Observable<string | undefined>;
  
  // Static copyright year
  public copyrightYear = new Date().getFullYear();

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  constructor() {
    this.diagnostics.debug(`${this.constructor.name}.constructor()`);
    
    // ✅ Get branding from account config (reactive)
    this.sponsorTitle$ = this.accountService.getConfigValue('context.sponsor.title');
    this.developerTitle$ = this.accountService.getConfigValue('context.developer.title');
  }

  ngOnInit(): void {
    this.diagnostics.debug(`${this.constructor.name}.ngOnInit()`);
  }
}
