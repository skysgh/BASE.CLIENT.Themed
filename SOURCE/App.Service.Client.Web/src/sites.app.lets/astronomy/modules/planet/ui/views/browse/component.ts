/**
 * Planet Browse Component
 * 
 * Browses all planets or planets within a specific star system.
 */
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { PageHeaderComponent } from '../../../../../../../sites/ui/widgets/page-header';
import { BaseCoreAgPipesModule } from '../../../../../../../core.ag/pipes/module';
import { AstronomyService } from '../../../../../services/astronomy.service';
import { Planet, StarSystem } from '../../../../../models';

@Component({
  selector: 'app-planet-browse',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    PageHeaderComponent, 
    BaseCoreAgPipesModule
  ],
  template: `
    <div class="planet-browse">
      <!-- Page Header -->
      <app-page-header 
        [title]="pageTitle()"
        icon="bx-planet"
        iconBackground="bg-info-subtle"
        iconClass="text-info"
        [backFallback]="backRoute()">
        <ng-container subtitle>
          {{ totalCount() }} planets
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
          @for (planet of filteredPlanets(); track planet.id) {
            <div class="col-md-6 col-lg-4">
              <div class="card h-100 planet-card" 
                   [class.habitable]="planet.habitableZone"
                   [routerLink]="['/apps/astronomy/planets', planet.id]">
                <div class="card-body">
                  <div class="d-flex align-items-start">
                    <div class="planet-icon me-3" 
                         [class.bg-success-subtle]="planet.habitableZone"
                         [class.text-success]="planet.habitableZone"
                         [class.bg-info-subtle]="!planet.habitableZone"
                         [class.text-info]="!planet.habitableZone">
                      <i class="bx" [class.bx-check-circle]="planet.habitableZone" [class.bx-planet]="!planet.habitableZone"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h5 class="mb-1">
                        {{ planet.name }}
                        @if (planet.rings) {
                          <i class="bx bx-radio-circle text-warning ms-1" title="Has rings"></i>
                        }
                      </h5>
                      <p class="text-muted small mb-2">{{ planet.type.name }}</p>
                      <div class="small text-muted mb-2">
                        <i class="bx bx-ruler me-1"></i> {{ planet.radius }} R⊕ · 
                        <i class="bx bx-sun me-1"></i> {{ planet.distanceFromStar }} AU
                      </div>
                      <div class="d-flex flex-wrap gap-2">
                        <span class="badge bg-secondary-subtle text-secondary">
                          {{ planet.moons.length }} {{ planet.moons.length === 1 ? 'moon' : 'moons' }}
                        </span>
                        @if (planet.habitableZone) {
                          <span class="badge bg-success">Habitable Zone</span>
                        }
                        @if (planet.atmosphere) {
                          <span class="badge bg-info-subtle text-info">
                            {{ planet.atmosphere.type.name }}
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
                <i class="bx bx-planet display-1 text-muted"></i>
                <h5 class="text-muted mt-3">No planets found</h5>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .planet-browse {
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .planet-card {
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid var(--vz-border-color);
      
      &:hover {
        border-color: var(--vz-primary);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      
      &.habitable {
        border-color: rgba(var(--bs-success-rgb), 0.3);
      }
    }
    
    .planet-icon {
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
export class PlanetBrowseComponent implements OnInit {
  private service = inject(AstronomyService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  // Context
  systemId = signal<string | null>(null);
  system = signal<StarSystem | null>(null);
  
  // State
  loading = signal(false);
  searchQuery = signal('');
  
  // Data
  allPlanets = signal<Planet[]>([]);
  
  // Computed
  pageTitle = computed(() => {
    const sys = this.system();
    return sys ? `Planets in ${sys.name}` : 'All Planets';
  });
  
  backRoute = computed(() => {
    const sysId = this.systemId();
    return sysId ? `apps/astronomy/star-systems/${sysId}` : 'apps/astronomy';
  });
  
  filteredPlanets = computed(() => {
    let planets = this.allPlanets();
    const query = this.searchQuery().toLowerCase();
    
    if (query) {
      planets = planets.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.type.name.toLowerCase().includes(query)
      );
    }
    
    return planets;
  });
  
  totalCount = computed(() => this.filteredPlanets().length);
  
  ngOnInit(): void {
    // Check if we're scoped to a star system
    const sysId = this.route.snapshot.paramMap.get('systemId');
    this.systemId.set(sysId);
    
    this.loadData();
  }
  
  private loadData(): void {
    this.loading.set(true);
    
    const sysId = this.systemId();
    
    if (sysId) {
      // Load system for context
      this.service.getStarSystem(sysId).subscribe(sys => {
        this.system.set(sys || null);
      });
      
      // Load planets in system
      this.service.getPlanetsInSystem(sysId).subscribe(planets => {
        this.allPlanets.set(planets);
        this.loading.set(false);
      });
    } else {
      // Load all planets
      this.service.getAllPlanets().subscribe(planets => {
        this.allPlanets.set(planets);
        this.loading.set(false);
      });
    }
  }
  
  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }
}
