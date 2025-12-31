import { Component, OnInit } from '@angular/core';

import { ServiceSettingsAccountSettingService } from '../../services/service-settings-account-setting.service';
import { AccountService } from '../../../../core/services/account.service';
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';

/**
 * Account Settings Section Component
 * 
 * Per-tenant settings (account admin).
 * Displays and manages account-specific configuration.
 */
@Component({
    selector: 'app-account-settings-section',
    imports: [],
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class AccountSettingsSectionComponent implements OnInit {
  accountName: string = '';

  constructor(
    public settingsService: ServiceSettingsAccountSettingService,
    private accountService: AccountService,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
  }

  ngOnInit(): void {
    this.accountService.getConfig().subscribe(config => {
      this.accountName = config.name;
    });
    this.settingsService.loadSettings();
  }
}
