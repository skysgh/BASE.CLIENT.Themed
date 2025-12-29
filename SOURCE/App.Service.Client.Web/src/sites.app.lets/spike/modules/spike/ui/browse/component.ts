import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Configuration:
import { appsConfiguration } from '../../../../../../sites.app/configuration/implementations/apps.configuration';
import { appletsSpikesConfiguration } from '../../../../configuration/implementations/app.lets.spikes.configuration';

// ✅ MIGRATED: Use applet-local Signal-based service (moved from core)
import { SpikeService } from '../../../../services/spike.service';
// ✅ MIGRATED: Use applet-local ViewModel (moved from core)
import { SpikeViewModel } from '../../../../models/view-models/spike.view-model';

import { DefaultComponentServices } from '../../../../../../core/services/default-controller-services';
import { ViewPreferenceService } from '../../../../../../core/views/view-preference.service';
// Models:
import { SummaryItemVTO } from '../../../../../../core/models/SummaryItem.vto.model';
import { ViewModel } from './vm';


@Component({
  selector: 'app-base-apps-spike-spikes-browse',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class BaseAppsSpikeSpikesBrowseComponent implements OnInit {
  // Expose system configuration:
  public appsConfiguration = appsConfiguration
  // Expose applet configuration:
  public appletConfiguration = appletsSpikesConfiguration

  // This controller's ViewModel:
  public viewModel: ViewModel = new ViewModel();

  // ✅ UPDATED: Use ViewModel types
  public page: number = 1;
  public data: SpikeViewModel[] = [];
  public summaryItems: SummaryItemVTO[] = [];
  
  // View renderer state
  public currentRenderer: string = 'browse-cards';
  
  // Table columns for table view
  public tableColumns = [
    { key: 'category', label: 'Category', width: '120px' },
    { key: 'description', label: 'Description' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private defaultControllerServices: DefaultComponentServices,
    private spikeService: SpikeService,
    private viewPrefService: ViewPreferenceService
  ) {
    this.defaultControllerServices.diagnosticsTraceService.info("Constructor");
    
    // Get preferred renderer
    this.currentRenderer = this.viewPrefService.getPreferredRendererId('spike', 'browse');
  }

  ngOnInit(): void {
    this.defaultControllerServices.diagnosticsTraceService.info("Component OnInit");
    
    // ✅ NEW: Use Signal-based service (data loads automatically in constructor)
    this.data = this.spikeService.spikes();
    this.summaryItems = this.data.map(i => this.mapToSummaryItem(i));
  }
  
  /**
   * Get available renderers for browse view
   */
  get availableRenderers() {
    return this.viewPrefService.getAvailableRenderers('browse');
  }

  /**
   * Check current renderer type
   */
  get isCardsView(): boolean {
    return this.currentRenderer.includes('cards');
  }

  get isTableView(): boolean {
    return this.currentRenderer.includes('table');
  }

  get isListView(): boolean {
    return this.currentRenderer.includes('list');
  }

  /**
   * Switch renderer
   */
  switchRenderer(rendererId: string): void {
    this.currentRenderer = rendererId;
    this.viewPrefService.setPreference('spike', 'browse', rendererId);
  }
  
  /**
   * Map SpikeViewModel to SummaryItemVTO for card display
   */
  mapToSummaryItem(spike: SpikeViewModel): SummaryItemVTO {
    const item = new SummaryItemVTO();
    item.id = spike.id;
    item.enabled = true;
    item.typeId = 'spike';
    item.type = 'Spike';
    item.typeImage = '';
    item.icon = 'bx-bulb';
    item.color = '#007bff';
    item.category = 'Feature'; // Would come from category lookup
    item.title = spike.title;
    item.description = spike.description || '';
    item.subtitle = spike.displayLabel;
    item.route = `/apps/spike/${spike.id}`;
    item.status = {
      label: 'Draft', // Would come from status lookup
      color: '#6c757d'
    };
    item.values = [];
    item.operations = [
      { title: 'BASE.ACTIONS.VIEW', action: 'view' },
      { title: 'BASE.ACTIONS.EDIT', action: 'edit' }
    ];
    return item;
  }

  /**
   * Handle summary item click
   */
  onItemClick(item: SummaryItemVTO): void {
    if (item.route) {
      this.router.navigate([item.route]);
    } else {
      this.router.navigate(['../', item.id], { relativeTo: this.route });
    }
  }

  /**
   * Handle operation click from summary item
   */
  onOperationClick(event: { item: SummaryItemVTO; action: string }): void {
    if (!event.item) return;
    
    switch (event.action) {
      case 'view':
        this.router.navigate(['../', event.item.id], { relativeTo: this.route });
        break;
      case 'edit':
        this.router.navigate(['../edit', event.item.id], { relativeTo: this.route });
        break;
    }
  }

  /**
   * Navigate to add new spike
   */
  onAddNew(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }
}
