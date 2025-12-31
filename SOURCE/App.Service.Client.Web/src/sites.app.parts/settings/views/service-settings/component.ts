import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceSettingsServiceSettingService } from '../../services/service-settings-service-setting.service';
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';

/**
 * Service Settings Section Component
 * 
 * Platform-wide settings (super admin only).
 * Displays and manages global service configuration.
 */
@Component({
  selector: 'app-service-settings-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class ServiceSettingsSectionComponent implements OnInit {

  constructor(
    public settingsService: ServiceSettingsServiceSettingService,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
  }

  ngOnInit(): void {
    this.settingsService.loadSettings();
  }
}
