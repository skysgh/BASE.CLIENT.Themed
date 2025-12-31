/**
 * SubSpike Add Component
 * 
 * Part of BREAD pattern for SubSpike entity.
 * Provides form for creating new sub-spikes under a parent spike.
 * 
 * Route: /apps/spike/:id/subspikes/add
 * 
 * Features:
 * - Formly-based dynamic form
 * - Parent spike context (breadcrumb)
 * - Validation
 * - Save/Cancel actions
 */
import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit, effect } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
// Configuration:
import { appletsSpikesConfiguration } from '../../../../configuration/implementations/app.lets.spikes.configuration';
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
import { SubSpikeService } from '../../../../services/sub-spike.service';
import { SpikeService } from '../../../../services/spike.service';
import { SpikeViewModel } from '../../../../models/view-models/spike.view-model';
// Forms:
import { getSubSpikeFormDefinition } from '../../../../forms/sub-spike-form.definitions';
import { toFormlyConfig, createFormlyModel } from '../../../../../../core/forms/formly-adapter';


@Component({
    selector: 'app-base-apps-spike-subspikes-add',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
export class BaseAppsSpikeSubSpikesAddComponent implements OnInit, OnDestroy, AfterViewInit {
  public appsConfiguration = appsConfiguration;
  public appletConfiguration = appletsSpikesConfiguration;

  // Parent spike context
  public parentSpikeId: string = '';
  public parentSpike?: SpikeViewModel;
  
  // Formly configuration
  form!: FormGroup;
  model: any = {};
  fields: FormlyFieldConfig[] = [];
  
  // Loading/saving state
  saving = false;
  saveError: string | null = null;
  
  // Form initialization flag
  formInitialized = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private defaultControllerServices: DefaultComponentServices,
    private subSpikeService: SubSpikeService,
    private spikeService: SpikeService,
    private cdr: ChangeDetectorRef
  ) {
    this.defaultControllerServices.diagnosticsTraceService.info("SubSpike Add: Constructor");
    
    // React to parent spike loading
    effect(() => {
      const spikes = this.spikeService.spikes();
      if (this.parentSpikeId && !this.parentSpike) {
        this.parentSpike = spikes.find(s => s.id === this.parentSpikeId);
      }
    });
  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.info("SubSpike Add: OnInit");
    
    // Get parent spike ID from route
    this.route.params.subscribe(params => {
      this.parentSpikeId = params['id'];
      this.defaultControllerServices.diagnosticsTraceService.info(`Parent spike id: ${this.parentSpikeId}`);
      
      // Try to get parent spike immediately
      this.parentSpike = this.spikeService.getById(this.parentSpikeId);
      
      // Initialize form
      this.initializeForm();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.formInitialized = true;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.defaultControllerServices.diagnosticsTraceService.info("SubSpike Add: OnDestroy");
  }

  /**
   * Initialize form for add mode
   */
  private initializeForm(): void {
    this.form = new FormGroup({});
    
    const formDef = getSubSpikeFormDefinition('add');
    this.fields = toFormlyConfig(formDef);
    this.model = createFormlyModel(formDef);
    
    this.saving = false;
    this.saveError = null;
    
    this.defaultControllerServices.diagnosticsTraceService.info("SubSpike Add: Form initialized");
  }

  /**
   * Save new sub-spike
   */
  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.saving = true;
    this.saveError = null;
    
    this.defaultControllerServices.diagnosticsTraceService.info(`Creating sub-spike: ${JSON.stringify(this.model)}`);
    
    this.subSpikeService.create(this.parentSpikeId, {
      ...this.model,
    }).subscribe({
      next: (result) => {
        this.saving = false;
        if (result) {
          this.defaultControllerServices.diagnosticsTraceService.info(`SubSpike created: ${result.id}`);
          // Navigate back to parent spike's read view
          // Current: /apps/spike/:id/subspikes/add
          // Target:  /apps/spike/:id
          this.router.navigate(['../..'], { relativeTo: this.route });
        } else {
          this.saveError = this.subSpikeService.error() || 'Failed to create sub-spike';
        }
      },
      error: (err) => {
        this.saving = false;
        this.saveError = 'Failed to create sub-spike: ' + (err?.message || 'Unknown error');
      }
    });
  }

  /**
   * Cancel creation
   */
  onCancel(): void {
    // Navigate back to parent spike's read view
    this.router.navigate(['../..'], { relativeTo: this.route });
  }

  /**
   * Check if create button should be disabled
   */
  get isCreateDisabled(): boolean {
    if (!this.formInitialized) return true;
    return this.saving || this.form.invalid;
  }
}
