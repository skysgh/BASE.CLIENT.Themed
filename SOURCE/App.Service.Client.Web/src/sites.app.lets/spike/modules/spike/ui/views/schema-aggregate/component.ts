/**
 * Spike Schema-Driven CRUD Page
 * 
 * Demonstrates the new EntityCrudPageComponent using EntitySchema.
 * This is a drop-in replacement for the individual add/edit/browse/read pages.
 * 
 * ROUTE: /applets/spike/schema-driven
 */

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// CRUD Page component
import {
  EntityCrudPageComponent,
  CrudCreateEvent,
  CrudUpdateEvent,
  CrudDeleteEvent,
  CrudPageState,
} from '../../../../../../../core.ag/ui/widgets/entity-crud-page';

// Schema - use the pre-defined Spike schema
import { SPIKE_ENTITY_SCHEMA } from '../../../../../../../core/models/schema/examples/spike-entity-schema.example';

// Services
import { ToastService } from '../../../../../../../core/services/toast.service';
import { SystemDiagnosticsTraceService } from '../../../../../../../core/services/system.diagnostics-trace.service';

// Domain - use SpikeViewModel from the correct location
import { SpikeViewModel } from '../../../../../models/view-models/spike.view-model';
import { SpikeService } from '../../../../../services/spike.service';

@Component({
  selector: 'app-spike-schema-crud',
  standalone: true,
  imports: [
    CommonModule,
    EntityCrudPageComponent,
  ],
  template: `
    <div class="container-fluid">
      <!-- Breadcrumb -->
      <div class="row">
        <div class="col-12">
          <div class="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 class="mb-sm-0">Spikes (Schema-Driven)</h4>
            <div class="page-title-right">
              <ol class="breadcrumb m-0">
                <li class="breadcrumb-item"><a href="javascript: void(0);">Applets</a></li>
                <li class="breadcrumb-item"><a href="javascript: void(0);">Spike</a></li>
                <li class="breadcrumb-item active">Schema CRUD</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <!-- CRUD Page -->
      <div class="row">
        <div class="col-12">
          <app-entity-crud-page
            [entitySchema]="entitySchema"
            [data]="spikes()"
            [loading]="loading()"
            [totalCount]="totalCount()"
            (create)="onCreate($event)"
            (update)="onUpdate($event)"
            (delete)="onDelete($event)"
            (loadData)="onLoadData($event)"
            (stateChange)="onStateChange($event)">
          </app-entity-crud-page>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpikeSchemaAggregateComponent implements OnInit {
  private diagnostics = inject(SystemDiagnosticsTraceService);
  private toastService = inject(ToastService);
  private spikeService = inject(SpikeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Use the pre-defined entity schema
  readonly entitySchema = SPIKE_ENTITY_SCHEMA;

  // State signals - derive from service signals
  spikes = signal<SpikeViewModel[]>([]);
  loading = signal(false);
  totalCount = signal(0);

  constructor() {
    // Effect to sync service state to component
    effect(() => {
      this.spikes.set(this.spikeService.spikes());
      this.totalCount.set(this.spikeService.spikes().length);
      this.loading.set(this.spikeService.loading());
    });
  }

  ngOnInit(): void {
    this.diagnostics.info('SpikeSchemaAggregateComponent initialized');
    // Service loads data on init, just trigger a refresh
    this.spikeService.refresh();
  }

  // ─────────────────────────────────────────────────────────────────
  // CRUD Operations
  // ─────────────────────────────────────────────────────────────────

  onCreate(event: CrudCreateEvent<SpikeViewModel>): void {
    this.diagnostics.info('Creating spike');
    
    this.spikeService.create(event.data).subscribe({
      next: (created) => {
        if (created) {
          this.toastService.showSuccess('Spike created successfully');
        }
      },
      error: (err: Error) => {
        this.toastService.showError('Failed to create spike');
        this.diagnostics.error('Failed to create spike: ' + err.message);
      },
    });
  }

  onUpdate(event: CrudUpdateEvent<SpikeViewModel>): void {
    this.diagnostics.info('Updating spike: ' + event.id);

    this.spikeService.update(event.id, event.data).subscribe({
      next: (updated) => {
        if (updated) {
          this.toastService.showSuccess('Spike updated successfully');
        }
      },
      error: (err: Error) => {
        this.toastService.showError('Failed to update spike');
        this.diagnostics.error('Failed to update spike: ' + err.message);
      },
    });
  }

  onDelete(event: CrudDeleteEvent): void {
    this.diagnostics.info('Deleting spike: ' + event.id);

    this.spikeService.delete(event.id).subscribe({
      next: (success) => {
        if (success) {
          this.toastService.showSuccess('Spike deleted successfully');
        }
      },
      error: (err: Error) => {
        this.toastService.showError('Failed to delete spike');
        this.diagnostics.error('Failed to delete spike: ' + err.message);
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // State Management
  // ─────────────────────────────────────────────────────────────────

  onLoadData(state: CrudPageState): void {
    this.diagnostics.debug('Load data requested: ' + JSON.stringify(state));
    this.spikeService.refresh();
  }

  onStateChange(state: CrudPageState): void {
    this.diagnostics.debug('State changed: ' + JSON.stringify(state));
    // Optionally sync to URL params
    // this.router.navigate([], { queryParams: { ... }, queryParamsHandling: 'merge' });
  }
}
