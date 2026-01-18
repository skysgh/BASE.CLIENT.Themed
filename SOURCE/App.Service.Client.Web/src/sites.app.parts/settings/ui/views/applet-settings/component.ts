import { Component, OnInit, ViewChild, ViewContainerRef, ComponentRef, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AppletSettingsRegistryService, AppletSettingsSchema, AppletSettingsSection } from '../../../services/applet-settings-registry.service';
import { SystemDiagnosticsTraceService } from '../../../../../core/services/system.diagnostics-trace.service';
import { BaseCoreAgPipesModule } from '../../../../../core.ag/pipes/module';

/**
 * Applet Settings Section Component
 * 
 * Dynamic component that displays settings for a specific applet.
 * Reads applet ID from route and loads registered settings schema.
 * Dynamically renders the registered settings component.
 */
@Component({
    selector: 'app-applet-settings-section',
    imports: [CommonModule, BaseCoreAgPipesModule],
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class AppletSettingsSectionComponent implements OnInit {
  @ViewChild('settingsContainer', { read: ViewContainerRef, static: false })
  settingsContainer!: ViewContainerRef;
  
  appletId: string = '';
  schema: AppletSettingsSchema | undefined;
  notFound: boolean = false;
  
  private componentRef: ComponentRef<any> | null = null;

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
      
      // Render the component after view init
      setTimeout(() => this.renderSettingsComponent(), 0);
    });
  }

  /**
   * Dynamically render the settings component
   */
  private renderSettingsComponent(): void {
    if (!this.settingsContainer || !this.schema) {
      return;
    }
    
    // Clear previous component
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
    this.settingsContainer.clear();
    
    // Get the first section with a component (for now, we render the first one)
    const sectionWithComponent = this.schema.sections.find(s => s.component);
    if (sectionWithComponent?.component) {
      this.componentRef = this.settingsContainer.createComponent(sectionWithComponent.component);
      this.logger.debug(`Rendered settings component for applet: ${this.appletId}`);
    }
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
