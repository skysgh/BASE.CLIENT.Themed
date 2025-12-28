// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Core utilities only (not domain-specific)
import { ConfigRegistryService } from '../../core/services/config-registry.service';

// ✅ FIXED: Use LOCAL applet services (not core - those were moved here)
import { ArchitectureValueService } from './services/architecture-value.service';
import { ArchitecturePrincipleTypeService } from './services/architecture-principle-type.service';
import { ArchitecturePrincipleService } from './services/architecture-principle.service';
import { ArchitectureQualityTypeService } from './services/architecture-quality-type.service';
import { ArchitectureQualityCategoryService } from './services/architecture-quality-category.service';
import { ArchitectureQualityService } from './services/architecture-quality.service';

// Module specific:
import { BaseAppsArchitectureRoutingModule } from "./routing.module";

// Child Modules:
import { BaseAppsArchitectureValuesModule } from "./modules/values/module";

// Applet constants
import { appletsArchitectureConstants } from './constants/implementations/app.lets.architecture.constants';

// ❌ REMOVED: Cross-tier coupling
// import { BaseThemesV1Module } from '../../themes/t1/module';
// import { BaseAppsModule } from '../../sites.app/module';

@NgModule({
  declarations: [
  ],
  providers: [
    // Local applet services
    ArchitectureValueService,
    ArchitecturePrincipleTypeService,
    ArchitecturePrincipleService,
    ArchitectureQualityTypeService,
    ArchitectureQualityCategoryService,
    ArchitectureQualityService
  ],
  imports: [
    CommonModule,
    FormsModule,
    BaseAppsArchitectureRoutingModule,
    BaseAppsArchitectureValuesModule
    // ❌ REMOVED: BaseAppsModule - breaks coupling to sites.app
  ],  
  exports: [
  ],
})
export class BaseAppsArchitectureModule {
  constructor(configRegistryService: ConfigRegistryService) {
    configRegistryService.register('applets.architecture', {
      constants: appletsArchitectureConstants
    });
  }
}
