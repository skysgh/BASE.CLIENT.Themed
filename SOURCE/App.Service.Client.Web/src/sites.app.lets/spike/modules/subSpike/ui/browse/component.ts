// Rx:

// Ag:
import { Component, OnInit, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Configuration:
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
import { appletsSpikesConfiguration } from '../../../../configuration/implementations/app.lets.spikes.configuration';
// Services:
import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
import { SubSpikeService } from '../../../../services/sub-spike.service';
import { SpikeService } from '../../../../services/spike.service';
// Models:
import { SubSpikeViewModel } from '../../../../models/view-models/sub-spike.view-model';
import { SpikeViewModel } from '../../../../models/view-models/spike.view-model';
import { ViewModel } from './vm';


@Component({
    selector: 'app-base-apps-spike-subspikes-browse',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
    standalone: false
})
export class BaseAppsSpikeSubSpikesBrowseComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose applet configuration:
  public appletConfiguration = appletsSpikesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  // Data
  public page: number = 1;
  public data: SubSpikeViewModel[] = [];
  
  // Parent spike (for breadcrumb)
  public parentSpike?: SpikeViewModel;
  public parentSpikeId?: string;
  
  // Loading state
  public loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private defaultControllerServices: DefaultComponentServices,
    public subSpikeService: SubSpikeService,
    private spikeService: SpikeService
  ) {
    this.defaultControllerServices.diagnosticsTraceService.info("SubSpike:Constructor");
    
    // React to signal changes
    effect(() => {
      const subSpikes = this.subSpikeService.subSpikes();
      const spikes = this.spikeService.spikes();
      const isLoading = this.subSpikeService.loading();
      
      // Update parent spike
      if (this.parentSpikeId) {
        this.parentSpike = spikes.find(s => s.id === this.parentSpikeId);
      }
      
      // Filter sub-spikes for this parent
      if (this.parentSpikeId && !isLoading) {
        this.data = subSpikes.filter(s => s.parentId === this.parentSpikeId);
        this.loading = false;
      }
    });
  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.info("SubSpike:Component OnInit");

    this.route.params.subscribe(params => {
      this.parentSpikeId = params['id'];
      this.defaultControllerServices.diagnosticsTraceService.info('Parent spike id: ' + this.parentSpikeId);
      
      // Reset state
      this.loading = true;
      
      // Try to get data immediately
      if (this.parentSpikeId) {
        this.parentSpike = this.spikeService.getById(this.parentSpikeId);
        this.data = this.subSpikeService.getByParentId(this.parentSpikeId);
        if (this.data.length > 0 || !this.subSpikeService.loading()) {
          this.loading = false;
        }
      }
    });
  }

  /**
   * Navigate to add sub-spike
   */
  onAddNew(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  /**
   * Navigate to view sub-spike
   */
  onView(subSpike: SubSpikeViewModel): void {
    this.router.navigate([subSpike.id], { relativeTo: this.route });
  }

  /**
   * Navigate to edit sub-spike
   */
  onEdit(subSpike: SubSpikeViewModel): void {
    this.router.navigate(['edit', subSpike.id], { relativeTo: this.route });
  }

  /**
   * Delete sub-spike
   */
  onDelete(subSpike: SubSpikeViewModel): void {
    if (!confirm(`Delete "${subSpike.title}"?`)) {
      return;
    }
    
    this.subSpikeService.delete(subSpike.id).subscribe();
  }

  /**
   * Navigate to parent spike
   */
  goToParent(): void {
    if (this.parentSpikeId) {
      this.router.navigate(['../../', this.parentSpikeId], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../spikes'], { relativeTo: this.route });
    }
  }

  /**
   * Navigate back
   */
  goBack(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.goToParent();
    }
  }
}
