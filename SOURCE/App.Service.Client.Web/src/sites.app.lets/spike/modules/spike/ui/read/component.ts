// Rx:
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
// Ag:
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
// Configuration:
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
import { appletsSpikesConfiguration } from '../../../../configuration/implementations/app.lets.spikes.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
import { ViewPreferenceService } from '../../../../../../core/views/view-preference.service';
// ✅ FIXED: Use local applet service
import { SpikeService } from '../../../../services/spike.service';
import { SpikeViewModel } from '../../../../models/view-models/spike.view-model';
import { ViewModel } from './vm';
// Domain models:
import { 
  SpikeStatusViewModel, 
  getAllowedTransitions, 
  DEFAULT_SPIKE_STATUSES, 
  mapSpikeStatusDtoToViewModel 
} from '../../../../domain/reference-data/spike-status.model';
// Forms:
import { getSpikeFormDefinition } from '../../../../forms/spike-form.definitions';
import { toFormlyConfig } from '../../../../../../core/forms/formly-adapter';
import { FormDefinition } from '../../../../../../core/forms/form-definition.model';


@Component({
  selector: 'app-base-apps-spike-spikes-read',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsSpikeSpikesReadComponent implements OnInit {
  public appsConfiguration = appsConfiguration;
  public appletConfiguration = appletsSpikesConfiguration;

  public viewModel: ViewModel = new ViewModel();
  public data?: SpikeViewModel;
  
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private defaultControllServices: DefaultComponentServices,
    private spikeService: SpikeService,
    private viewPrefService: ViewPreferenceService
  ) {
    this.defaultControllServices.diagnosticsTraceService.info("Constructor");
    
    // Load all statuses
    this.allStatuses = DEFAULT_SPIKE_STATUSES.map(mapSpikeStatusDtoToViewModel);
    
    // Load form definition for view mode
    this.formDefinition = getSpikeFormDefinition('view');
    
    // Get preferred renderer
    this.currentRenderer = this.viewPrefService.getPreferredRendererId('spike', 'read');
  }

  ngOnInit(): void {
    this.defaultControllServices.diagnosticsTraceService.info("Component OnInit");

    this.route.params.subscribe(params => {
      const id = params['id'];
      this.defaultControllServices.diagnosticsTraceService.info(`params ready. id:${id}`);
      this.data = this.spikeService.getById(id);
      
      if (this.data) {
        // Create extended data with defaults for fields not in SpikeViewModel
        const statusId = (this.data as any).statusId || '1';
        const status = this.allStatuses.find(s => s.id === statusId) || this.allStatuses[0];
        
        this.extendedData = {
          statusId: statusId,
          statusName: status?.name || 'Draft',
          statusIcon: status?.icon || 'bx-edit',
          statusColor: status?.color || '#6c757d',
          categoryId: (this.data as any).categoryId || '1',
          categoryName: 'Feature',
          categoryIcon: 'bx-bulb',
          priority: (this.data as any).priority || 3,
          priorityLabel: 'Medium',
          dueDate: (this.data as any).dueDate || null,
          dueDateFormatted: '',
          isOverdue: false,
          estimatedEffort: (this.data as any).estimatedEffort || 0,
          classificationIds: (this.data as any).classificationIds || [],
          parts: (this.data as any).parts || [],
          items: (this.data as any).items || [],
          itemCount: ((this.data as any).items || []).length,
          totalValue: null,
          createdAt: new Date(),
          modifiedAt: new Date(),
        };
        
        // Set up form model for Formly
        this.formModel = {
          title: this.data.title,
          description: this.data.description,
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
      }
    });
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

  public DoSomething() {
    this.defaultControllServices.diagnosticsTraceService.info("blah");
  }
}
