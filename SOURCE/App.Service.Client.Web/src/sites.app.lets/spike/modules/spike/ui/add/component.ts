// Import Ag:
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
// Configuration:
import { appletsSpikesConfiguration } from '../../../../configuration/implementations/app.lets.spikes.configuration';
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
import { SpikeService } from '../../../../services/spike.service';
// Forms:
import { getSpikeFormDefinition } from '../../../../forms/spike-form.definitions';
import { toFormlyConfig, createFormlyModel } from '../../../../../../core/forms/formly-adapter';
import { FormEngineType } from '../../../../../../core/forms/form-definition.model';


@Component({
  selector: 'app-base-apps-spike-spikes-add',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsSpikeSpikesAddComponent implements OnInit {
  public appsConfiguration = appsConfiguration;
  public appletConfiguration = appletsSpikesConfiguration;

  // Formly configuration
  form = new FormGroup({});
  model: any = {};
  fields: FormlyFieldConfig[] = [];
  
  // Form engine toggle (for comparison)
  formEngine: FormEngineType = 'formly';
  
  // Loading/saving state
  saving = false;
  saveError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private defaultControllerServices: DefaultComponentServices,
    private spikeService: SpikeService
  ) {
    this.defaultControllerServices.diagnosticsTraceService.info("Constructor");
  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.info("Component OnInit");

    // Load form definition for Add mode
    const formDef = getSpikeFormDefinition('add');
    this.fields = toFormlyConfig(formDef);
    this.model = createFormlyModel(formDef);
  }

  /**
   * Save new spike
   */
  onSave(): void {
    if (this.form.invalid) {
      // Mark all fields as touched to show validation errors
      this.form.markAllAsTouched();
      return;
    }
    
    this.saving = true;
    this.saveError = null;
    
    this.defaultControllerServices.diagnosticsTraceService.info(`Creating spike: ${JSON.stringify(this.model)}`);
    
    // Call service to create
    this.spikeService.create({
      ...this.model,
      statusId: '1', // Draft
    }).subscribe({
      next: (result) => {
        this.saving = false;
        if (result) {
          this.defaultControllerServices.diagnosticsTraceService.info(`Spike created: ${result.id}`);
          // Navigate to the new spike's read view
          this.router.navigate(['../', result.id], { relativeTo: this.route });
        } else {
          this.saveError = this.spikeService.error() || 'Failed to create spike';
        }
      },
      error: (err) => {
        this.saving = false;
        this.saveError = 'Failed to create spike: ' + (err?.message || 'Unknown error');
      }
    });
  }

  /**
   * Cancel creation
   */
  onCancel(): void {
    this.router.navigate(['../spikes'], { relativeTo: this.route });
  }

  /**
   * Toggle form engine (for comparison)
   */
  toggleFormEngine(): void {
    this.formEngine = this.formEngine === 'formly' ? 'jsonforms' : 'formly';
    this.defaultControllerServices.diagnosticsTraceService.info(`Switched form engine to: ${this.formEngine}`);
  }
}
