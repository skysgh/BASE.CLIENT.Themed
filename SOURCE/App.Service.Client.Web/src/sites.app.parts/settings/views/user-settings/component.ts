import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceSettingsUserSettingService } from '../../services/service-settings-user-setting.service';
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';

/**
 * User Settings Section Component
 * 
 * Per-user preferences (all users).
 * Displays and manages user-specific settings.
 */
@Component({
    selector: 'app-user-settings-section',
    imports: [CommonModule],
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class UserSettingsSectionComponent implements OnInit {

  constructor(
    public settingsService: ServiceSettingsUserSettingService,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
  }

  ngOnInit(): void {
    this.settingsService.loadSettings();
  }
}
