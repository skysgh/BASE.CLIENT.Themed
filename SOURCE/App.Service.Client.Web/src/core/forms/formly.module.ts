import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyLabelFieldComponent } from '../../core.ag/formly/types/label/formly-label.type';

/**
 * Formly Configuration Module
 * 
 * Central configuration for Formly forms.
 * Import this module in any feature module that uses Formly.
 * 
 * Provides:
 * - Bootstrap-styled form controls
 * - Custom validators
 * - Custom field types (extensible)
 * - 'label' type for read-only views
 */
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyLabelFieldComponent, // Standalone component
    FormlyModule.forRoot({
      validationMessages: [
        { name: 'required', message: 'This field is required' },
        { name: 'minLength', message: (err, field) => `Minimum length is ${field.props?.['minLength']}` },
        { name: 'maxLength', message: (err, field) => `Maximum length is ${field.props?.['maxLength']}` },
        { name: 'min', message: (err, field) => `Minimum value is ${field.props?.['min']}` },
        { name: 'max', message: (err, field) => `Maximum value is ${field.props?.['max']}` },
        { name: 'email', message: 'Invalid email address' },
        { name: 'pattern', message: 'Invalid format' },
      ],
      types: [
        // Label type for read-only views
        { name: 'label', component: FormlyLabelFieldComponent },
        // Aliases
        { name: 'readonly', component: FormlyLabelFieldComponent },
        { name: 'display', component: FormlyLabelFieldComponent },
      ],
      validators: [
        // Add custom validators here
      ],
    }),
    FormlyBootstrapModule,
  ],
  exports: [
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
  ],
})
export class CoreFormlyModule {}
