import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AppletSettingsRegistryService, AppletSettingsSchema } from '../../services/applet-settings-registry.service';
import { SystemDiagnosticsTraceService } from '../../../../core/services/system.diagnostics-trace.service';

/**
 * Applet Settings Section Component
 * 
 * Dynamic component that displays settings for a specific applet.
 * Reads applet ID from route and loads registered settings schema.
 */
@Component({
    selector: 'app-applet-settings-section',
    imports: [CommonModule],
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class AppletSettingsSectionComponent implements OnInit {
  appletId: string = '';
  schema: AppletSettingsSchema | undefined;
  notFound: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private appletRegistry: AppletSettingsRegistryService,
    private logger: SystemDiagnosticsTraceService
  ) {
    this.logger.debug(`${this.constructor.name} initialized`);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.appletId = params['appletId'];
      this.schema = this.appletRegistry.get(this.appletId);
      this.notFound = !this.schema;
      
      this.logger.debug(
        `Loading settings for applet: ${this.appletId}, found: ${!this.notFound}`
      );
    });
  }
}
