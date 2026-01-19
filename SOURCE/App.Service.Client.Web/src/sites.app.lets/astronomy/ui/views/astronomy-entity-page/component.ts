/**
 * Astronomy Schema-Driven Entity Page
 * 
 * Universal component that renders any Astronomy entity using EntityCrudPageComponent.
 * The entity type is determined by route data.
 * 
 * This replaces custom browse/read/edit/add components for each entity.
 * 
 * ROUTES:
 * - /apps/astronomy/star-systems      → StarSystem CRUD
 * - /apps/astronomy/planets           → Planet CRUD
 * - /apps/astronomy/astronomers       → Astronomer CRUD
 */
import {
  Component,
  OnInit,
  inject,
  signal,
  effect,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// Core CRUD component
import {
  EntityCrudPageComponent,
  CrudCreateEvent,
  CrudUpdateEvent,
  CrudDeleteEvent,
  CrudPageState,
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
export class AstronomyEntityPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private diagnostics = inject(SystemDiagnosticsTraceService);
  private toastService = inject(ToastService);
  private astronomyService = inject(AstronomyService);

  // Entity type from route data
  entityType = signal<string>('');
  
  // Resolved schema based on entity type
  entitySchema = computed(() => {
    const type = this.entityType();
    return type ? ENTITY_SCHEMAS[type] : null;
  });

  // Data signals
  data = signal<any[]>([]);
  loading = signal(false);
  totalCount = signal(0);

  // Parent context for embedded browse (e.g., planets within a star system)
  parentContext = signal<{ entityId: string; id: string } | null>(null);

  constructor() {
    // Sync data from service based on entity type
    effect(() => {
      const type = this.entityType();
      if (type === 'starSystem') {
        this.data.set(this.astronomyService.starSystems());
        this.totalCount.set(this.astronomyService.starSystems().length);
      }
      // Planets and astronomers would need similar getters in the service
      this.loading.set(this.astronomyService.loading());
    });
  }

  ngOnInit(): void {
    // Get entity type from route data
    const routeData = this.route.snapshot.data;
    const entityType = routeData['entityType'] || 'starSystem';
    this.entityType.set(entityType);

    // Check for parent context (e.g., /star-systems/:systemId/planets)
    const systemId = this.route.snapshot.paramMap.get('systemId');
    if (systemId) {
      this.parentContext.set({ entityId: 'starSystem', id: systemId });
    }

    this.diagnostics.info(`AstronomyEntityPage initialized for: ${entityType}`);
    
    // Load initial data
    this.loadData();
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
    // Add similar for planets, astronomers
  }

  // ─────────────────────────────────────────────────────────────────
  // CRUD Operations
  // ─────────────────────────────────────────────────────────────────

  onCreate(event: CrudCreateEvent): void {
    const type = this.entityType();
    this.diagnostics.info(`Creating ${type}`);
    
    // TODO: Implement create via service
    this.toastService.showInfo(`Create ${type} - not yet implemented`);
  }

  onUpdate(event: CrudUpdateEvent): void {
    const type = this.entityType();
    this.diagnostics.info(`Updating ${type}: ${event.id}`);
    
    // TODO: Implement update via service
    this.toastService.showInfo(`Update ${type} - not yet implemented`);
  }

  onDelete(event: CrudDeleteEvent): void {
    const type = this.entityType();
    this.diagnostics.info(`Deleting ${type}: ${event.id}`);
    
    // TODO: Implement delete via service
    this.toastService.showInfo(`Delete ${type} - not yet implemented`);
  }

  onLoadData(state: CrudPageState): void {
    this.diagnostics.info(`Load data requested with state: ${JSON.stringify(state)}`);
    this.loadData();
  }

  onStateChange(state: CrudPageState): void {
    this.diagnostics.info(`State changed: ${state.mode}`);
    // Could sync to URL here if needed
  }
}
