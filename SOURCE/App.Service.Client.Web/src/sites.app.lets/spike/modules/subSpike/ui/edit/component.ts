/**
 * SubSpike Edit Component
 * 
 * Part of BREAD pattern for SubSpike entity.
 * Provides form for editing existing sub-spikes.
 * 
 * Route: /apps/spike/:id/subspikes/edit/:subId
 * 
 * Features:
 * - Formly-based dynamic form
 * - Pre-populated with existing data
 * - Save/Cancel actions
 * - Breadcrumb navigation
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
import { SubSpikeViewModel } from '../../../../models/view-models/sub-spike.view-model';
import { SpikeViewModel } from '../../../../models/view-models/spike.view-model';
// Forms:
import { getSubSpikeFormDefinition } from '../../../../forms/sub-spike-form.definitions';
import { toFormlyConfig, createFormlyModel } from '../../../../../../core/forms/formly-adapter';
import { ViewModel } from './vm';


@Component({
    selector: 'app-base-apps-spike-subspikes-edit',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
export class BaseAppsSpikeSubSpikesEditComponent implements OnInit, OnDestroy, AfterViewInit {
  public appsConfiguration = appsConfiguration;
  public appletConfiguration = appletsSpikesConfiguration;
  public viewModel: ViewModel = new ViewModel();

  // Route IDs
  public parentSpikeId: string = '';
  public subSpikeId: string = '';
  
  // Data
  public data?: SubSpikeViewModel;
  public parentSpike?: SpikeViewModel;
  
  // State
  public loading = true;
  public notFound = false;
  public saving = false;
  public saveError: string | null = null;
  
  // Form
  form!: FormGroup;
  model: any = {};
  fields: FormlyFieldConfig[] = [];
  formInitialized = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private defaultControllerServices: DefaultComponentServices,
    private subSpikeService: SubSpikeService,
    private spikeService: SpikeService,
    private cdr: ChangeDetectorRef
  ) {
    this.defaultControllerServices.diagnosticsTraceService.info("SubSpike Edit: Constructor");
    
    // React to signal changes
    effect(() => {
      const subSpikes = this.subSpikeService.subSpikes();
      const spikes = this.spikeService.spikes();
      const isLoading = this.subSpikeService.loading();
      
      // Find parent spike
      if (this.parentSpikeId && !this.parentSpike) {
        this.parentSpike = spikes.find(s => s.id === this.parentSpikeId);
      }
      
      // Find sub-spike when data loads
      if (this.subSpikeId && !isLoading && !this.data) {
        const subSpike = subSpikes.find(s => s.id === this.subSpikeId);
        if (subSpike) {
          this.loadData(subSpike);
        } else if (subSpikes.length > 0) {
          this.notFound = true;
          this.loading = false;
        }
      }
    });
  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.info("SubSpike Edit: OnInit");
    
    this.route.params.subscribe(params => {
      this.parentSpikeId = params['id'];
      this.subSpikeId = params['subId'];
      
      this.defaultControllerServices.diagnosticsTraceService.info(
        `Parent: ${this.parentSpikeId}, SubSpike: ${this.subSpikeId}`
      );
      
      // Reset state
      this.loading = true;
      this.notFound = false;
      this.data = undefined;
      
      // Try to get data immediately
      this.parentSpike = this.spikeService.getById(this.parentSpikeId);
      const subSpike = this.subSpikeService.getById(this.subSpikeId);
      if (subSpike) {
        this.loadData(subSpike);
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.formInitialized = true;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.defaultControllerServices.diagnosticsTraceService.info("SubSpike Edit: OnDestroy");
  }

  /**
   * Load sub-spike data into form
   */
  private loadData(subSpike: SubSpikeViewModel): void {
    this.data = subSpike;
    this.loading = false;
    this.notFound = false;
    
    // Initialize form with existing data
    this.form = new FormGroup({});
    
    const formDef = getSubSpikeFormDefinition('edit');
    this.fields = toFormlyConfig(formDef);
    
    // Pre-populate model with existing data
    this.model = {
      title: subSpike.title,
      description: subSpike.description || '',
      // Add other fields as needed
    };
    
    this.saving = false;
    this.saveError = null;
    
    this.defaultControllerServices.diagnosticsTraceService.info(`Loaded sub-spike for editing: ${subSpike.title}`);
  }

  /**
   * Save changes
   */
  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.saving = true;
    this.saveError = null;
    
    this.defaultControllerServices.diagnosticsTraceService.info(`Updating sub-spike: ${JSON.stringify(this.model)}`);
    
    this.subSpikeService.update(this.subSpikeId, this.model).subscribe({
      next: (result) => {
        this.saving = false;
        if (result) {
          this.defaultControllerServices.diagnosticsTraceService.info(`SubSpike updated: ${result.id}`);
          // Navigate to read view
          this.router.navigate(['../../', this.subSpikeId], { relativeTo: this.route });
        } else {
          this.saveError = this.subSpikeService.error() || 'Failed to update sub-spike';
        }
      },
      error: (err) => {
        this.saving = false;
        this.saveError = 'Failed to update sub-spike: ' + (err?.message || 'Unknown error');
      }
    });
  }

  /**
   * Cancel editing
   */
  onCancel(): void {
    // Navigate back to read view
    this.router.navigate(['../../', this.subSpikeId], { relativeTo: this.route });
  }

  /**
   * Check if save button should be disabled
   */
  get isSaveDisabled(): boolean {
    if (!this.formInitialized) return true;
    return this.saving || this.form.invalid;
  }
}
