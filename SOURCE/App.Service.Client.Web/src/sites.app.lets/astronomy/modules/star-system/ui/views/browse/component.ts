/**
 * Star System Browse Component
 * 
 * Uses a simplified card layout (not full BrowseView) for clarity.
 */
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../../../../sites/ui/widgets/page-header';
import { BaseCoreAgPipesModule } from '../../../../../../../core.ag/pipes/module';
import { AstronomyService } from '../../../../../services/astronomy.service';
import { StarSystem } from '../../../../../models';

@Component({
  selector: 'app-star-system-browse',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    PageHeaderComponent, 
    BaseCoreAgPipesModule
  ],
  template: `
    <div class="star-system-browse">
      <!-- Page Header -->
      <app-page-header 
        title="Star Systems"
        icon="bx-sun"
        iconBackground="bg-warning-subtle"
        iconClass="text-warning"
        backFallback="apps/astronomy">
        <ng-container subtitle>
          {{ totalCount() }} star systems catalogued
        </ng-container>
        <ng-container actions>
          <div class="input-group input-group-sm" style="width: 250px;">
            <span class="input-group-text"><i class="bx bx-search"></i></span>
            <input 
              type="text" 
              class="form-control" 
              placeholder="Search..."
              [value]="searchQuery()"
              (input)="onSearchChange($any($event.target).value)">
          </div>
        </ng-container>
      </app-page-header>

      @if (loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>
      } @else {
        <!-- Cards Grid -->
        <div class="row g-3">
          @for (system of filteredSystems(); track system.id) {
            <div class="col-md-6 col-lg-4">
              <div class="card h-100 system-card" 
                   [routerLink]="['/apps/astronomy/star-systems', system.id]">
                <div class="card-body">
                  <div class="d-flex align-items-start">
                    <div class="system-icon bg-warning-subtle text-warning me-3">
                      <i class="bx bx-sun"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h5 class="mb-1">{{ system.name }}</h5>
                      <p class="text-muted small mb-2">{{ system.distanceFromEarth }} light years</p>
                      <p class="mb-2 small">{{ system.description | slice:0:100 }}{{ system.description.length > 100 ? '...' : '' }}</p>
                      <div class="d-flex flex-wrap gap-2">
                        <span class="badge bg-warning-subtle text-warning">
                          {{ system.stars.length }} {{ system.stars.length === 1 ? 'star' : 'stars' }}
                        </span>
                        <span class="badge bg-info-subtle text-info">
                          {{ system.planets.length }} {{ system.planets.length === 1 ? 'planet' : 'planets' }}
                        </span>
                        @if (getHabitableCount(system) > 0) {
                          <span class="badge bg-success-subtle text-success">
                            {{ getHabitableCount(system) }} habitable
                          </span>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          } @empty {
            <div class="col-12">
              <div class="text-center py-5">
                <i class="bx bx-sun display-1 text-muted"></i>
                <h5 class="text-muted mt-3">No star systems found</h5>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .star-system-browse {
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .system-card {
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid var(--vz-border-color);
      
      &:hover {
        border-color: var(--vz-primary);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
    }
    
    .system-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }
  `]
})
export class StarSystemBrowseComponent implements OnInit {
  private service = inject(AstronomyService);
  private router = inject(Router);
  
  // State
  loading = signal(false);
  searchQuery = signal('');
  
  // Data
  allSystems = signal<StarSystem[]>([]);
  
  // Computed
  filteredSystems = computed(() => {
    let systems = this.allSystems();
    const query = this.searchQuery().toLowerCase();
    
    if (query) {
      systems = systems.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query)
      );
    }
    
    return systems;
  });
  
  totalCount = computed(() => this.filteredSystems().length);
  
  ngOnInit(): void {
    this.loadData();
  }
  
  private loadData(): void {
    this.loading.set(true);
    this.service.getStarSystems().subscribe(systems => {
      this.allSystems.set(systems);
      this.loading.set(false);
    });
  }
  
  getHabitableCount(system: StarSystem): number {
    return system.planets.filter(p => p.habitableZone).length;
  }
  
  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }
}
