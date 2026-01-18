/**
 * Star System Read Component
 * 
 * Detail view for a single star system showing stars, planets, and relationships.
 */
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../../../../sites/ui/widgets/page-header';
import { BaseCoreAgPipesModule } from '../../../../../../../core.ag/pipes/module';
import { AstronomyService } from '../../../../../services/astronomy.service';
import { StarSystem, Star, Planet } from '../../../../../models';

@Component({
  selector: 'app-star-system-read',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent, BaseCoreAgPipesModule],
  template: `
    <div class="star-system-read">
      @if (loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>
      } @else if (system(); as sys) {
        <!-- Page Header -->
        <app-page-header 
          [title]="sys.name"
          icon="bx-sun"
          iconBackground="bg-warning-subtle"
          iconClass="text-warning"
          backFallback="apps/astronomy/star-systems">
          <ng-container subtitle>
            {{ sys.distanceFromEarth }} light years from Earth
          </ng-container>
        </app-page-header>

        <!-- Description -->
        <div class="card mb-4">
          <div class="card-body">
            <p class="mb-2">{{ sys.description }}</p>
            <div class="d-flex gap-3 text-muted small">
              <span><i class="bx bx-calendar me-1"></i> Discovered: {{ sys.discoveredAt | date:'yyyy' }}</span>
              <span><i class="bx bx-user me-1"></i> By: {{ sys.discoveredBy }}</span>
            </div>
          </div>
        </div>

        <!-- Stats Row -->
        <div class="row g-3 mb-4">
          <div class="col-md-3">
            <div class="card text-center h-100">
              <div class="card-body">
                <h3 class="text-warning">{{ sys.stars.length }}</h3>
                <p class="text-muted mb-0">Stars</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-center h-100">
              <div class="card-body">
                <h3 class="text-info">{{ sys.planets.length }}</h3>
                <p class="text-muted mb-0">Planets</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-center h-100">
              <div class="card-body">
                <h3 class="text-secondary">{{ totalMoons() }}</h3>
                <p class="text-muted mb-0">Moons</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card text-center h-100">
              <div class="card-body">
                <h3 class="text-success">{{ habitablePlanets() }}</h3>
                <p class="text-muted mb-0">Habitable Zone</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Stars Section -->
        <div class="card mb-4">
          <div class="card-header">
            <h6 class="mb-0">
              <i class="bx bx-sun text-warning me-2"></i>
              Stars (1-* relationship)
            </h6>
          </div>
          <div class="card-body">
            <div class="row g-3">
              @for (star of sys.stars; track star.id) {
                <div class="col-md-4">
                  <div class="star-card p-3 rounded border">
                    <div class="d-flex align-items-center mb-2">
                      <div 
                        class="star-dot me-2" 
                        [style.background]="star.type.color">
                      </div>
                      <strong>{{ star.name }}</strong>
                    </div>
                    <div class="small text-muted">
                      <div><i class="bx bx-category me-1"></i> {{ star.type.name }}</div>
                      <div><i class="bx bx-expand me-1"></i> {{ star.mass }} M☉ / {{ star.radius }} R☉</div>
                      <div><i class="bx bx-bulb me-1"></i> {{ star.luminosity }} L☉</div>
                      @if (star.constellations.length > 0) {
                        <div>
                          <i class="bx bx-star me-1"></i> 
                          Constellations (*-*): {{ getConstellationNames(star) }}
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Planets Section -->
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h6 class="mb-0">
              <i class="bx bx-planet text-info me-2"></i>
              Planets (1-* relationship, each has *-1 to Star, 1-1 to Atmosphere, 1-* to Moons)
            </h6>
            <a [routerLink]="['planets']" class="btn btn-sm btn-soft-info">
              View All <i class="bx bx-chevron-right"></i>
            </a>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Planet</th>
                    <th>Type</th>
                    <th>Orbits (*-1)</th>
                    <th>Distance (AU)</th>
                    <th>Atmosphere (1-1)</th>
                    <th>Moons (1-*)</th>
                    <th>Habitable</th>
                  </tr>
                </thead>
                <tbody>
                  @for (planet of sys.planets; track planet.id) {
                    <tr [class.table-success]="planet.habitableZone" 
                        [routerLink]="['/apps/astronomy/planets', planet.id]"
                        style="cursor: pointer;">
                      <td>
                        <strong>{{ planet.name }}</strong>
                        @if (planet.rings) {
                          <i class="bx bx-radio-circle text-warning ms-1" title="Has rings"></i>
                        }
                      </td>
                      <td>{{ planet.type.name }}</td>
                      <td>{{ getStarName(planet.orbitsStarId) }}</td>
                      <td>{{ planet.distanceFromStar }}</td>
                      <td>
                        @if (planet.atmosphere) {
                          {{ planet.atmosphere.type.name }}
                        } @else {
                          <span class="text-muted">Unknown</span>
                        }
                      </td>
                      <td>
                        {{ planet.moons.length }}
                        @if (planet.moons.length > 0) {
                          <span class="text-muted small ms-1">
                            ({{ planet.moons.slice(0, 2).map(m => m.name).join(', ') }}{{ planet.moons.length > 2 ? '...' : '' }})
                          </span>
                        }
                      </td>
                      <td>
                        @if (planet.habitableZone) {
                          <span class="badge bg-success">Yes</span>
                        } @else {
                          <span class="badge bg-secondary">No</span>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      } @else {
        <div class="alert alert-warning">
          Star system not found
        </div>
      }
    </div>
  `,
  styles: [`
    .star-system-read {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .star-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      box-shadow: 0 0 8px currentColor;
    }
    
    .star-card {
      background: var(--vz-light);
      transition: all 0.2s ease;
      
      &:hover {
        background: var(--vz-body-bg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
    }
    
    .table-success {
      --bs-table-bg: rgba(var(--bs-success-rgb), 0.1);
    }
  `]
})
export class StarSystemReadComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(AstronomyService);
  
  loading = signal(true);
  system = signal<StarSystem | null>(null);
  
  totalMoons = computed(() => 
    this.system()?.planets.reduce((acc, p) => acc + p.moons.length, 0) || 0
  );
  
  habitablePlanets = computed(() => 
    this.system()?.planets.filter(p => p.habitableZone).length || 0
  );
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getStarSystem(id).subscribe(sys => {
        this.system.set(sys || null);
        this.loading.set(false);
      });
    } else {
      this.loading.set(false);
    }
  }
  
  getStarName(starId: string): string {
    const star = this.system()?.stars.find(s => s.id === starId);
    return star?.name || starId;
  }
  
  getConstellationNames(star: Star): string {
    return star.constellations.map(c => c.name).join(', ');
  }
}
