// Ag dependencies:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Module specific components
import { BaseAppsArchitectureValuesBrowseComponent } from "./ui/browse/component";
import { ArchitectureValuesBrowseItemComponent } from "./ui/browse/item/component";
import { BaseAppsArchitectureValuesReadComponent } from "./ui/read/component";
import { BaseAppsArchitectureValuesEditComponent } from "./ui/edit/component";

// ✅ FIXED: Use local applet service
import { ArchitectureValueService } from '../../services/architecture-value.service';

// ❌ REMOVED: Broken/coupling imports
// import { ArchitectureValuesRepositoryService } from '../../services/repositories/values-repository.service';
// import { BaseAppsModule } from '../../../module';

@NgModule({
  declarations: [
    BaseAppsArchitectureValuesBrowseComponent,
    ArchitectureValuesBrowseItemComponent,
    BaseAppsArchitectureValuesReadComponent,
    BaseAppsArchitectureValuesEditComponent
  ],
  providers: [
    ArchitectureValueService
  ],
  imports: [
    CommonModule,
    FormsModule
    // ❌ REMOVED: No parent module import - breaks coupling
  ],
  exports: [
  ]
})
export class BaseAppsArchitectureValuesModule { }
