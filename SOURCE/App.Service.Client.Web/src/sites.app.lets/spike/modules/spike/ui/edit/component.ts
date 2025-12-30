// Import Ag:
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Subject, takeUntil } from 'rxjs';
// Configuration:
import { appletsSpikesConfiguration } from '../../../../configuration/implementations/app.lets.spikes.configuration';
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
import { SpikeService } from '../../../../services/spike.service';
import { SpikeViewModel } from '../../../../models/view-models/spike.view-model';
import { ViewModel } from './vm';
// Forms:
import { getSpikeFormDefinition } from '../../../../forms/spike-form.definitions';
import { toFormlyConfig, createFormlyModel } from '../../../../../../core/forms/formly-adapter';
import { FormEngineType } from '../../../../../../core/forms/form-definition.model';


@Component({
  selector: 'app-base-apps-spike-spikes-edit',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsSpikeSpikesEditComponent implements OnInit, OnDestroy {
  public appsConfiguration = appsConfiguration;
  public appletConfiguration = appletsSpikesConfiguration;

  public viewModel: ViewModel = new ViewModel();
  public data?: SpikeViewModel;

  // Formly configuration - recreated on each init
  form!: FormGroup;
  model: any = {};
  fields: FormlyFieldConfig[] = [];
  
  // Form engine toggle (for comparison)
  formEngine: FormEngineType = 'formly';
  
  // Loading/saving state
  saving = false;
  saveError: string | null = null;
  
  // Cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private defaultControllerServices: DefaultComponentServices,
    private spikeService: SpikeService
  ) {
    this.defaultControllerServices.diagnosticsTraceService.info("Edit Component: Constructor");
  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.info("Edit Component: OnInit");

    // Always create a fresh FormGroup
    this.form = new FormGroup({});
    
    // Load form definition
    const formDef = getSpikeFormDefinition('edit');
    this.fields = toFormlyConfig(formDef);
    
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params['id'];
        this.defaultControllerServices.diagnosticsTraceService.info('Loading spike id: ' + id);
        this.data = this.spikeService.getById(id);
        
        if (this.data) {
          // Populate form model from data
          this.model = {
            title: this.data.title,
            description: this.data.description || '',
            categoryId: (this.data as any).categoryId || '1',
            priority: (this.data as any).priority || 3,
            dueDate: (this.data as any).dueDate || null,
            estimatedEffort: (this.data as any).estimatedEffort || null,
            classificationIds: (this.data as any).classificationIds || [],
          };
        }
      });
  }

  ngOnDestroy(): void {
    this.defaultControllerServices.diagnosticsTraceService.info("Edit Component: OnDestroy");
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Save changes
   */
  onSave(): void {
    if (this.form.invalid) {
      // Mark all fields as touched to show validation errors
      this.form.markAllAsTouched();
      return;
    }
    
    if (!this.data) return;
    
    this.saving = true;
    this.saveError = null;
    
    this.defaultControllerServices.diagnosticsTraceService.info(`Saving spike: ${JSON.stringify(this.model)}`);
    
    // Call service to update
    this.spikeService.update(this.data.id, {
      ...this.model,
      statusId: (this.data as any).statusId || '1',
    }).subscribe({
      next: (result) => {
        this.saving = false;
        if (result) {
          this.defaultControllerServices.diagnosticsTraceService.info('Spike saved successfully');
          this.router.navigate(['..'], { relativeTo: this.route });
        } else {
          this.saveError = this.spikeService.error() || 'Failed to save spike';
        }
      },
      error: (err) => {
        this.saving = false;
        this.saveError = 'Failed to save spike: ' + (err?.message || 'Unknown error');
      }
    });
  }

  /**
   * Cancel editing
   */
  onCancel(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  /**
   * Toggle form engine (for comparison)
   */
  toggleFormEngine(): void {
    this.formEngine = this.formEngine === 'formly' ? 'jsonforms' : 'formly';
    this.defaultControllerServices.diagnosticsTraceService.info(`Switched form engine to: ${this.formEngine}`);
  }
}
