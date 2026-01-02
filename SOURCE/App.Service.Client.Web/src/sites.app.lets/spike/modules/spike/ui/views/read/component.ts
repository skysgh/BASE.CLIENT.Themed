// Rx:
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
// Ag:
import { Component, OnInit, effect } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
// Configuration:
import { appsConfiguration } from '../../../../../../../sites.app/configuration/implementations/apps.configuration';
import { appletsSpikesConfiguration } from '../../../../../configuration/implementations/app.lets.spikes.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../../core/services/default-controller-services';
import { ViewPreferenceService } from '../../../../../../../core/views/view-preference.service';
// ✅ FIXED: Use local applet service
import { SpikeService } from '../../../../../services/spike.service';
import { SubSpikeService } from '../../../../../services/sub-spike.service';
import { SpikeViewModel } from '../../../../../models/view-models/spike.view-model';
import { ViewModel } from './vm';
// Domain models:
import { 
  SpikeStatusViewModel, 
  getAllowedTransitions, 
  DEFAULT_SPIKE_STATUSES, 
  mapSpikeStatusDtoToViewModel 
} from '../../../../../domain/reference-data/spike-status.model';
// Forms:
import { getSpikeFormDefinition } from '../../../../../forms/spike-form.definitions';
import { toFormlyConfig } from '../../../../../../../core/forms/formly-adapter';
import { FormDefinition } from '../../../../../../../core/forms/form-definition.model';
// Summary component types
import { SummaryItem } from '../../../../../../../core/components/child-summary/child-summary.component';


@Component({
    selector: 'app-base-apps-spike-spikes-read',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
export class BaseAppsSpikeSpikesReadComponent implements OnInit {
  public appsConfiguration = appsConfiguration;
  public appletConfiguration = appletsSpikesConfiguration;

  public viewModel: ViewModel = new ViewModel();
  public data?: SpikeViewModel;
  
  // Track the current ID from route
  private currentId: string | null = null;
  
  // Loading state
  public loading = true;
  public notFound = false;
  
  // Extended data (from domain model, for display)
  public extendedData: any = {};
  
  // Status and workflow
  public allStatuses: SpikeStatusViewModel[] = [];
  public allowedTransitions: SpikeStatusViewModel[] = [];
  public transitioning = false;
  
  // Form configuration for read view
  public formDefinition?: FormDefinition;
  public form = new FormGroup({});
  public fields: FormlyFieldConfig[] = [];
  public formModel: any = {};
  
  // View renderer state
  public currentRenderer: string = 'read-formly-labels';
  
  // SubSpikes summary data (S in I-S-BREAD-T)
  public subSpikeSummaryItems: SummaryItem[] = [];
  public subSpikesLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private defaultControllServices: DefaultComponentServices,
    public spikeService: SpikeService,
    public subSpikeService: SubSpikeService,
    private viewPrefService: ViewPreferenceService
  ) {
    this.defaultControllServices.diagnosticsTraceService.info("Constructor");
    
    // Load all statuses
    this.allStatuses = DEFAULT_SPIKE_STATUSES.map(mapSpikeStatusDtoToViewModel);
    
    // Load form definition for view mode
    this.formDefinition = getSpikeFormDefinition('view');
    
    // Get preferred renderer
    this.currentRenderer = this.viewPrefService.getPreferredRendererId('spike', 'read');
    
    // ✅ FIXED: React to signal changes - when spikes are loaded, find our spike
    effect(() => {
      const spikes = this.spikeService.spikes();
      const isLoading = this.spikeService.loading();
      
      if (this.currentId && !isLoading) {
        const spike = spikes.find(s => s.id === this.currentId);
        if (spike) {
          this.loadSpikeData(spike);
        } else if (spikes.length > 0) {
          // Spikes loaded but ours not found
          this.notFound = true;
          this.loading = false;
        }
      }
      
      // Update loading state from service
      if (!isLoading && this.loading && spikes.length > 0) {
        this.loading = false;
      }
    });
    
    // React to SubSpikes loading
    effect(() => {
      const subSpikes = this.subSpikeService.subSpikes();
      const isLoading = this.subSpikeService.loading();
      
      this.subSpikesLoading = isLoading;
      
      if (this.currentId && !isLoading) {
        // Filter sub-spikes for this parent and map to SummaryItem
        const parentSubSpikes = subSpikes.filter(s => s.parentId === this.currentId);
        this.subSpikeSummaryItems = parentSubSpikes.map(s => ({
          id: s.id,
          title: s.title,
          statusId: '1', // Default, could be extended
          statusName: 'Active',
          statusColor: '#28a745'
        }));
      }
    });
  }

  ngOnInit(): void {
    this.defaultControllServices.diagnosticsTraceService.info("Component OnInit");

    this.route.params.subscribe(params => {
      const id = params['id'];
      this.currentId = id;
      this.defaultControllServices.diagnosticsTraceService.info(`params ready. id:${id}`);
      
      // Reset state for new ID
      this.loading = true;
      this.notFound = false;
      this.data = undefined;
      
      // Try to find spike immediately (might already be loaded)
      const spike = this.spikeService.getById(id);
      if (spike) {
        this.loadSpikeData(spike);
      }
      // If not found, the effect() will handle it when spikes load
    });
  }

  /**
   * Load spike data into component state
   */
  private loadSpikeData(spike: SpikeViewModel): void {
    this.data = spike;
    this.loading = false;
    this.notFound = false;
    
    // Create extended data with defaults for fields not in SpikeViewModel
    const statusId = (spike as any).statusId || '1';
    const status = this.allStatuses.find(s => s.id === statusId) || this.allStatuses[0];
    
    this.extendedData = {
      statusId: statusId,
      statusName: status?.name || 'Draft',
      statusIcon: status?.icon || 'bx-edit',
      statusColor: status?.color || '#6c757d',
      categoryId: (spike as any).categoryId || '1',
      categoryName: 'Feature',
      categoryIcon: 'bx-bulb',
      priority: (spike as any).priority || 3,
      priorityLabel: 'Medium',
      dueDate: (spike as any).dueDate || null,
      dueDateFormatted: '',
      isOverdue: false,
      estimatedEffort: (spike as any).estimatedEffort || 0,
      classificationIds: (spike as any).classificationIds || [],
      parts: (spike as any).parts || [],
      items: (spike as any).items || [],
      itemCount: ((spike as any).items || []).length,
      totalValue: null,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    
    // Set up form model for Formly
    this.formModel = {
      title: spike.title,
      description: spike.description,
      categoryId: this.extendedData.categoryId,
      statusId: this.extendedData.statusId,
      priority: this.extendedData.priority,
      dueDate: this.extendedData.dueDate,
      estimatedEffort: this.extendedData.estimatedEffort,
      classificationIds: this.extendedData.classificationIds,
    };
    
    // Generate Formly fields for view mode (labels, not inputs)
    if (this.formDefinition) {
      this.fields = toFormlyConfig(this.formDefinition, true);
    }
    
    // Calculate allowed transitions
    this.allowedTransitions = getAllowedTransitions(statusId, this.allStatuses);
    
    this.defaultControllServices.diagnosticsTraceService.info(`Loaded spike: ${spike.title}`);
  }

  /**
   * Check if using Formly renderer
   */
  get isFormlyRenderer(): boolean {
    return this.currentRenderer.includes('formly');
  }

  /**
   * Check if using custom renderer
   */
  get isCustomRenderer(): boolean {
    return this.currentRenderer.includes('custom');
  }

  /**
   * Get available renderers for read view
   */
  get availableRenderers() {
    return this.viewPrefService.getAvailableRenderers('read');
  }

  /**
   * Switch renderer
   */
  switchRenderer(rendererId: string): void {
    this.currentRenderer = rendererId;
    this.viewPrefService.setPreference('spike', 'read', rendererId);
  }

  /**
   * Navigate to edit view
   */
  onEdit(): void {
    if (this.data) {
      this.router.navigate(['../edit', this.data.id], { relativeTo: this.route });
    }
  }

  /**
   * Execute state transition
   */
  onTransition(targetStatus: SpikeStatusViewModel): void {
    if (!this.data) return;
    
    this.transitioning = true;
    this.defaultControllServices.diagnosticsTraceService.info(
      `Transitioning spike ${this.data.id} from ${this.extendedData.statusId} to ${targetStatus.id}`
    );
    
    // TODO: Implement actual transition via service
    // For now, simulate
    setTimeout(() => {
      // Update extended data
      this.extendedData = {
        ...this.extendedData,
        statusId: targetStatus.id,
        statusName: targetStatus.name,
        statusIcon: targetStatus.icon,
        statusColor: targetStatus.color,
      };
      
      // Update form model
      this.formModel = {
        ...this.formModel,
        statusId: targetStatus.id,
      };
      
      // Recalculate allowed transitions
      this.allowedTransitions = getAllowedTransitions(targetStatus.id, this.allStatuses);
      this.transitioning = false;
    }, 500);
  }

  /**
   * Get transition button style based on target status
   */
  getTransitionButtonClass(status: SpikeStatusViewModel): string {
    switch (status.code) {
      case 'SUBMITTED':
        return 'btn-primary';
      case 'APPROVED':
        return 'btn-success';
      case 'REJECTED':
        return 'btn-danger';
      case 'ARCHIVED':
        return 'btn-secondary';
      case 'DRAFT':
        return 'btn-warning';
      default:
        return 'btn-outline-secondary';
    }
  }

  /**
   * Get transition action label
   */
  getTransitionLabel(status: SpikeStatusViewModel): string {
    switch (status.code) {
      case 'SUBMITTED':
        return 'Submit for Review';
      case 'APPROVED':
        return 'Approve';
      case 'REJECTED':
        return 'Reject';
      case 'ARCHIVED':
        return 'Archive';
      case 'DRAFT':
        return 'Revise';
      default:
        return `Move to ${status.name}`;
    }
  }

  /**
   * Navigate back to spikes list
   */
  onBackToList(): void {
    this.router.navigate(['../spikes'], { relativeTo: this.route });
  }

  /**
   * Navigate to SubSpikes browse
   */
  onBrowseSubSpikes(): void {
    this.router.navigate(['subspikes'], { relativeTo: this.route });
  }

  /**
   * Navigate to add SubSpike
   */
  onAddSubSpike(): void {
    this.router.navigate(['subspikes', 'add'], { relativeTo: this.route });
  }

  public DoSomething() {
    this.defaultControllServices.diagnosticsTraceService.info("blah");
  }
}
