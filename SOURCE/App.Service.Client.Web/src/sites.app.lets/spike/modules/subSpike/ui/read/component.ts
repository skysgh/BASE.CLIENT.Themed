/**
 * SubSpike Read Component
 * 
 * Part of BREAD pattern for SubSpike entity.
 * Displays read-only view of a sub-spike with actions.
 * 
 * Route: /apps/spike/:id/subspikes/:subId
 * 
 * Features:
 * - Breadcrumb navigation (Spikes → Parent → SubSpikes → This)
 * - Read-only form display
 * - Edit/Delete actions
 * - State transitions
 */
import { Component, OnInit, effect } from '@angular/core';
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
import { toFormlyConfig } from '../../../../../../core/forms/formly-adapter';
import { ViewModel } from './vm';


@Component({
  selector: 'app-base-apps-spike-subspikes-read',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsSpikeSubSpikesReadComponent implements OnInit {
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
  public deleting = false;
  
  // Form for view mode (labels)
  public form = new FormGroup({});
  public fields: FormlyFieldConfig[] = [];
  public formModel: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private defaultControllerServices: DefaultComponentServices,
    private subSpikeService: SubSpikeService,
    private spikeService: SpikeService
  ) {
    this.defaultControllerServices.diagnosticsTraceService.info("SubSpike Read: Constructor");
    
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
      if (this.subSpikeId && !isLoading) {
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
    this.defaultControllerServices.diagnosticsTraceService.info("SubSpike Read: OnInit");
    
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

  /**
   * Load sub-spike data into component
   */
  private loadData(subSpike: SubSpikeViewModel): void {
    this.data = subSpike;
    this.loading = false;
    this.notFound = false;
    
    // Set up form model
    this.formModel = {
      title: subSpike.title,
      description: subSpike.description || '',
    };
    
    // Generate read-only Formly fields
    const formDef = getSubSpikeFormDefinition('view');
    this.fields = toFormlyConfig(formDef, true);
    
    this.defaultControllerServices.diagnosticsTraceService.info(`Loaded sub-spike: ${subSpike.title}`);
  }

  /**
   * Navigate to edit view
   */
  onEdit(): void {
    this.router.navigate(['../edit', this.subSpikeId], { relativeTo: this.route });
  }

  /**
   * Delete sub-spike
   */
  onDelete(): void {
    if (!confirm('Are you sure you want to delete this sub-spike?')) {
      return;
    }
    
    this.deleting = true;
    
    this.subSpikeService.delete(this.subSpikeId).subscribe({
      next: (success) => {
        this.deleting = false;
        if (success) {
          // Navigate back to sub-spikes list
          this.router.navigate(['../../'], { relativeTo: this.route });
        }
      },
      error: () => {
        this.deleting = false;
      }
    });
  }

  /**
   * Navigate back to sub-spikes list
   */
  onBack(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
