// Import Ag:
import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
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
export class BaseAppsSpikeSpikesAddComponent implements OnInit, OnDestroy, AfterViewInit {
  public appsConfiguration = appsConfiguration;
  public appletConfiguration = appletsSpikesConfiguration;

  // Formly configuration - recreated on each init
  form!: FormGroup;
  model: any = {};
  fields: FormlyFieldConfig[] = [];
  
  // Form engine toggle (for comparison)
  formEngine: FormEngineType = 'formly';
  
  // Loading/saving state
  saving = false;
  saveError: string | null = null;
  
  // Track if component is initialized
  private initialized = false;

  // Initialize as true to avoid ExpressionChangedAfterItHasBeenCheckedError
  formInitialized = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private defaultControllerServices: DefaultComponentServices,
    private spikeService: SpikeService,
    private cdr: ChangeDetectorRef
  ) {
    this.defaultControllerServices.diagnosticsTraceService.info("Add Component: Constructor");
  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.info("Add Component: OnInit");
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    // Mark form as initialized after first render cycle to prevent ExpressionChanged error
    setTimeout(() => {
      this.formInitialized = true;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.defaultControllerServices.diagnosticsTraceService.info("Add Component: OnDestroy");
    this.initialized = false;
  }

  /**
   * Initialize or reinitialize the form
   */
  private initializeForm(): void {
    // Always create a fresh FormGroup
    this.form = new FormGroup({
    });
    
    // Load form definition for Add mode
    const formDef = getSpikeFormDefinition('add');
    this.fields = toFormlyConfig(formDef);
    this.model = createFormlyModel(formDef);
    
    // Reset state
    this.saving = false;
    this.saveError = null;
    this.initialized = true;
    
    this.defaultControllerServices.diagnosticsTraceService.info("Add Component: Form initialized");
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

  /**
   * Check if create button should be disabled
   */
  get isCreateDisabled(): boolean {
    if (!this.formInitialized) return true;
    return this.saving || this.form.invalid;
  }
}
