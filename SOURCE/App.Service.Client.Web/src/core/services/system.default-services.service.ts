// Rx:

// Ag:
import { Injectable } from '@angular/core';
// Configuration:
import { appsConfiguration } from '../sites.app/configuration/implementations/apps.configuration';
// Services:
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
import { SystemErrorService } from './system.error.service';
import { SystemSettingsService } from './service-settings.service';


@Injectable({ providedIn: 'root' })

/**
 * Injectable service to provide quick easy access to common services:
 * - System settings
 * - Diagnostics logging
 * - Error recording
 */
// Injectable service to develope diagnostic tracing messages to help diagnose issues.
export class SystemDefaultServices {

  // Expose system configuration:
  public appsConfiguration = appsConfiguration

  //public diagnosticsTraceService: SystemDiagnosticsTraceService;

  /**
   * Constructor
   * @param diagnosticsTraceService
   */
  constructor(
    public systemSettingsService: SystemSettingsService,
    public diagnosticsTraceService: SystemDiagnosticsTraceService,
    public errorService: SystemErrorService) {

    this.diagnosticsTraceService.debug(`${this.constructor.name}.constructor(...)`);

  }
}


