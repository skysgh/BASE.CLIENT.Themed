/**
 * Astronomy Schema-Driven Entity Page
 * 
 * Universal component that renders any Astronomy entity using EntityCrudPageComponent.
 * The entity type, mode, and ID are determined by route.
 * 
 * This replaces custom browse/read/edit/add components for each entity.
 * 
 * URL PATTERNS:
 * - /apps/astronomy/star-systems-v2           → Browse
 * - /apps/astronomy/star-systems-v2/new       → Add
 * - /apps/astronomy/star-systems-v2/:id       → Detail
 * - /apps/astronomy/star-systems-v2/:id/edit  → Edit
 */
import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  effect,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// Core CRUD component
import {
  EntityCrudPageComponent,
  CrudCreateEvent,
  CrudUpdateEvent,
  CrudDeleteEvent,
  CrudPageState,
  CrudPageMode,
} from '../../../../../core.ag/ui/widgets/entity-crud-page';

// Schemas
import { EntitySchema } from '../../../../../core/models/schema/entity-schema.model';
import { 
  STAR_SYSTEM_ENTITY_SCHEMA, 
  PLANET_ENTITY_SCHEMA, 
  ASTRONOMER_ENTITY_SCHEMA 
} from '../../../schemas';

// Services
import { ToastService } from '../../../../../core/services/toast.service';
import { SystemDiagnosticsTraceService } from '../../../../../core/services/system.diagnostics-trace.service';
import { AstronomyService } from '../../../services/astronomy.service';

// Entity type map
const ENTITY_SCHEMAS: Record<string, EntitySchema> = {
  'starSystem': STAR_SYSTEM_ENTITY_SCHEMA,
  'planet': PLANET_ENTITY_SCHEMA,
  'astronomer': ASTRONOMER_ENTITY_SCHEMA,
};

// Route path map (entity type -> base path)
const ENTITY_ROUTES: Record<string, string> = {
  'starSystem': 'star-systems-v2',
  'planet': 'planets-v2',
  'astronomer': 'astronomers',
};

@Component({
  selector: 'app-astronomy-entity-page',
  standalone: true,
  imports: [
    CommonModule,
    EntityCrudPageComponent,
  ],
  template: `
  <div class="astronomy-entity-page">
    @if (entitySchema()) {
      <app-entity-crud-page
        [entitySchema]="entitySchema()!"
        [data]="data()"
        [loading]="loading()"
        [totalCount]="totalCount()"
        [controlsLayout]="'flyout'"
        [initialMode]="initialMode()"
        [initialSelectedId]="selectedId()"
        [useRouterNavigation]="true"
        [routeBasePath]="routeBasePath()"
        (create)="onCreate($event)"
        (update)="onUpdate($event)"
        (delete)="onDelete($event)"
        (loadData)="onLoadData($event)"
        (stateChange)="onStateChange($event)">
      </app-entity-crud-page>
    } @else {
      <div class="alert alert-warning">
        <i class="bx bx-error me-2"></i>
        Unknown entity type: {{ entityType() }}
      </div>
      }
    </div>
  `,
  styles: [`
    .astronomy-entity-page {
      padding: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AstronomyEntityPageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private diagnostics = inject(SystemDiagnosticsTraceService);
  private toastService = inject(ToastService);
  private astronomyService = inject(AstronomyService);
  
  private destroy$ = new Subject<void>();

  // Route-derived state
  entityType = signal<string>('');
  initialMode = signal<CrudPageMode>('browse');
  selectedId = signal<string | undefined>(undefined);
  
  // Resolved schema based on entity type
  entitySchema = computed(() => {
    const type = this.entityType();
    return type ? ENTITY_SCHEMAS[type] : null;
  });
  
  // Base path for router navigation
  routeBasePath = computed(() => {
    const type = this.entityType();
    return type ? `/apps/astronomy/${ENTITY_ROUTES[type]}` : '';
  });

  // Data signals
  data = signal<any[]>([]);
  loading = signal(false);
  totalCount = signal(0);

  constructor() {
    // Sync data from service based on entity type
    effect(() => {
      const type = this.entityType();
      if (type === 'starSystem') {
        this.data.set(this.astronomyService.starSystems());
        this.totalCount.set(this.astronomyService.starSystems().length);
      }
      this.loading.set(this.astronomyService.loading());
    });
  }

  ngOnInit(): void {
    // Subscribe to route changes for reactive updates
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
      const entityType = data['entityType'] || 'starSystem';
      const mode = data['mode'] || 'browse';
      this.entityType.set(entityType);
      this.initialMode.set(mode as CrudPageMode);
      this.diagnostics.info(`Route data: entityType=${entityType}, mode=${mode}`);
    });
    
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params.get('id') || undefined;
      this.selectedId.set(id);
      this.diagnostics.info(`Route params: id=${id}`);
    });
    
    // Load initial data
    this.loadData();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    const type = this.entityType();
    this.loading.set(true);
    
    if (type === 'starSystem') {
      this.astronomyService.getStarSystems().subscribe({
        next: () => this.loading.set(false),
        error: () => {
          this.loading.set(false);
          this.toastService.showError('Failed to load star systems');
        }
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // CRUD Operations
  // ─────────────────────────────────────────────────────────────────

  onCreate(event: CrudCreateEvent): void {
    const type = this.entityType();
    this.diagnostics.info(`Creating ${type}: ${JSON.stringify(event.data)}`);
    
    if (type === 'starSystem') {
      this.astronomyService.createStarSystem(event.data as any).subscribe({
        next: (created) => {
          this.toastService.showSuccess(`Star System "${(created as any).name}" created`);
          this.loadData();
        },
        error: (err) => {
          this.toastService.showError(`Failed to create: ${err.message}`);
        }
      });
    } else {
      this.toastService.showInfo(`Create ${type} - not yet implemented`);
    }
  }

  onUpdate(event: CrudUpdateEvent): void {
    const type = this.entityType();
    this.diagnostics.info(`Updating ${type}: ${event.id}`);
    
    if (type === 'starSystem') {
      this.astronomyService.updateStarSystem(event.id, event.data as any).subscribe({
        next: (updated) => {
          if (updated) {
            this.toastService.showSuccess(`Star System "${(updated as any).name}" updated`);
          } else {
            this.toastService.showError('Star System not found');
          }
        },
        error: (err) => {
          this.toastService.showError(`Failed to update: ${err.message}`);
        }
      });
    } else {
      this.toastService.showInfo(`Update ${type} - not yet implemented`);
    }
  }

  onDelete(event: CrudDeleteEvent): void {
    const type = this.entityType();
    this.diagnostics.info(`Deleting ${type}: ${event.id}`);
    
    if (type === 'starSystem') {
      this.astronomyService.deleteStarSystem(event.id).subscribe({
        next: () => {
          this.toastService.showSuccess('Star System deleted');
          this.loadData();
        },
        error: (err) => {
          this.toastService.showError(`Failed to delete: ${err.message}`);
        }
      });
    } else {
      this.toastService.showInfo(`Delete ${type} - not yet implemented`);
    }
  }

  onLoadData(state: CrudPageState): void {
    this.diagnostics.info(`Load data requested`);
    this.loadData();
  }

  onStateChange(state: CrudPageState): void {
    // State is managed via URL now, no need to track here
  }
}
