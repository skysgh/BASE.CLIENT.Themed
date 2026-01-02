/**
 * Forms Reference Module
 * 
 * Near-direct copy from Velzon theme: pages/form
 * Provides form component reference pages for developers.
 * 
 * Source: Velzon (Minimal) - form module
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

// Select Dropdown
import { NgSelectModule } from '@ng-select/ng-select';
// Ui Switch
import { UiSwitchModule } from 'ngx-ui-switch';
// FlatPicker
import { FlatpickrModule } from 'angularx-flatpickr';
// Color Picker
import { ColorPickerModule } from 'ngx-color-picker';
// Mask
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
// Ngx Sliders
import { NgxSliderModule } from 'ngx-slider-v2';
// Wizard
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
// Ck Editor
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// Drop Zone
import { DropzoneModule, DROPZONE_CONFIG, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
// Auto Complete
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

// Load Icons
import { defineElement } from "@lordicon/element";
import lottie from 'lottie-web';

// Compatibility shim for breadcrumbs
import { DevBreadcrumbsComponent } from '../../ui/widgets/breadcrumbs/component';

// Routing
import { FormsReferenceRoutingModule } from './routing';

// Component pages
import { BasicComponent } from './basic/basic.component';
import { SelectComponent } from './select/select.component';
import { CheckboxsRadiosComponent } from './checkboxs-radios/checkboxs-radios.component';
import { PickersComponent } from './pickers/pickers.component';
import { MasksComponent } from './masks/masks.component';
import { AdvancedComponent } from './advanced/advanced.component';
import { RangeSlidersComponent } from './range-sliders/range-sliders.component';
import { ValidationComponent } from './validation/validation.component';
import { WizardComponent } from './wizard/wizard.component';
import { EditorsComponent } from './editors/editors.component';
import { FileUploadsComponent } from './file-uploads/file-uploads.component';
import { LayoutsComponent } from './layouts/layouts.component';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};

@NgModule({
  declarations: [
    BasicComponent,
    SelectComponent,
    CheckboxsRadiosComponent,
    PickersComponent,
    MasksComponent,
    AdvancedComponent,
    RangeSlidersComponent,
    ValidationComponent,
    WizardComponent,
    EditorsComponent,
    FileUploadsComponent,
    LayoutsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbNavModule,
    NgSelectModule,
    UiSwitchModule,
    FlatpickrModule,
    ColorPickerModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgxSliderModule,
    CdkStepperModule,
    NgStepperModule,
    CKEditorModule,
    DropzoneModule,
    AutocompleteLibModule,
    FormsReferenceRoutingModule,
    DevBreadcrumbsComponent
  ],
  providers: [
    provideNgxMask(),
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FormsReferenceModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
