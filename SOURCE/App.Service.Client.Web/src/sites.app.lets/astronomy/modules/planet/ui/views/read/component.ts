/**
 * Planet Read Component
 * 
 * Detail view for a single planet showing all relationships:
 * - *-1 to Star (orbits)
 * - 1-1 to Atmosphere
 * - 1-* to Moons
 */
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PageHeaderComponent } from '../../../../../../../sites/ui/widgets/page-header';
import { BaseCoreAgPipesModule } from '../../../../../../../core.ag/pipes/module';
import { AstronomyService } from '../../../../../services/astronomy.service';
import { Planet, StarSystem } from '../../../../../models';

@Component({
  selector: 'app-planet-read',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent, BaseCoreAgPipesModule],
  template: `
    <div class="planet-read">
      @if (loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>
      } @else if (planet(); as p) {
        <!-- Page Header -->
        <app-page-header 
          [title]="p.name"
          icon="bx-planet"
          [iconBackground]="p.habitableZone ? 'bg-success-subtle' : 'bg-info-subtle'"
          [iconClass]="p.habitableZone ? 'text-success' : 'text-info'"
          backFallback="apps/astronomy/planets">
          <ng-container subtitle>
            {{ p.type.name }} planet
            @if (p.habitableZone) {
              · <span class="text-success">In Habitable Zone</span>
            }
          </ng-container>
        </app-page-header>

        <div class="row g-4">
          <!-- Left Column: Properties -->
          <div class="col-lg-8">
            <!-- Basic Info -->
            <div class="card mb-4">
              <div class="card-header">
                <h6 class="mb-0">
                  <i class="bx bx-info-circle me-2"></i>
                  Physical Properties
                </h6>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-md-4">
                    <div class="property-item">
                      <label class="text-muted small">Type</label>
                      <div class="fw-medium">{{ p.type.name }}</div>
                      <small class="text-muted">{{ p.type.description }}</small>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="property-item">
                      <label class="text-muted small">Radius</label>
                      <div class="fw-medium">{{ p.radius }} R⊕</div>
                      <small class="text-muted">Earth radii</small>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="property-item">
                      <label class="text-muted small">Mass</label>
                      <div class="fw-medium">{{ p.mass }} M⊕</div>
                      <small class="text-muted">Earth masses</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Orbital Info (*-1 relationship to Star) -->
            <div class="card mb-4">
              <div class="card-header">
                <h6 class="mb-0">
                  <i class="bx bx-sun text-warning me-2"></i>
                  Orbit (*-1 relationship to Star)
                </h6>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-md-4">
                    <div class="property-item">
                      <label class="text-muted small">Parent Star</label>
                      <div class="fw-medium">{{ getStarName(p.orbitsStarId) }}</div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="property-item">
                      <label class="text-muted small">Distance from Star</label>
                      <div class="fw-medium">{{ p.distanceFromStar }} AU</div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="property-item">
                      <label class="text-muted small">Orbital Period</label>
                      <div class="fw-medium">{{ p.orbitalPeriod }} days</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Atmosphere (1-1 relationship) -->
            <div class="card mb-4">
              <div class="card-header">
                <h6 class="mb-0">
                  <i class="bx bx-cloud me-2"></i>
                  Atmosphere (1-1 relationship)
                </h6>
              </div>
              <div class="card-body">
                @if (p.atmosphere; as atm) {
                  <div class="row g-3">
                    <div class="col-md-4">
                      <div class="property-item">
                        <label class="text-muted small">Type</label>
                        <div class="fw-medium">{{ atm.type.name }}</div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="property-item">
                        <label class="text-muted small">Composition</label>
                        <div class="fw-medium">{{ atm.type.composition }}</div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="property-item">
                        <label class="text-muted small">Pressure</label>
                        <div class="fw-medium">{{ atm.pressure }} atm</div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="property-item">
                        <label class="text-muted small">Weather</label>
                        <div class="fw-medium">
                          @if (atm.hasWeather) {
                            <span class="text-success"><i class="bx bx-check"></i> Yes</span>
                          } @else {
                            <span class="text-muted">No</span>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                } @else {
                  <p class="text-muted mb-0">No known atmosphere or data unavailable.</p>
                }
              </div>
            </div>

            <!-- Moons (1-* relationship) -->
            <div class="card">
              <div class="card-header">
                <h6 class="mb-0">
                  <i class="bx bx-moon me-2"></i>
                  Moons (1-* relationship) · {{ p.moons.length }} total
                </h6>
              </div>
              <div class="card-body">
                @if (p.moons.length === 0) {
                  <p class="text-muted mb-0">No known moons.</p>
                } @else {
                  <div class="table-responsive">
                    <table class="table table-sm mb-0">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Radius (R⊕)</th>
                          <th>Orbital Period (days)</th>
                          <th>Tidally Locked</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (moon of p.moons; track moon.id) {
                          <tr>
                            <td><strong>{{ moon.name }}</strong></td>
                            <td>{{ moon.radius }}</td>
                            <td>{{ moon.orbitalPeriod }}</td>
                            <td>
                              @if (moon.tidallyLocked) {
                                <span class="badge bg-info-subtle text-info">Yes</span>
                              } @else {
                                <span class="badge bg-secondary-subtle text-secondary">No</span>
                              }
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Right Column: Quick Stats -->
          <div class="col-lg-4">
            <!-- Quick Facts -->
            <div class="card mb-4">
              <div class="card-header">
                <h6 class="mb-0">Quick Facts</h6>
              </div>
              <div class="card-body">
                <ul class="list-unstyled mb-0">
                  <li class="d-flex justify-content-between py-2 border-bottom">
                    <span class="text-muted">Has Rings</span>
                    <span>
                      @if (p.rings) {
                        <i class="bx bx-check text-success"></i> Yes
                      } @else {
                        <i class="bx bx-x text-muted"></i> No
                      }
                    </span>
                  </li>
                  <li class="d-flex justify-content-between py-2 border-bottom">
                    <span class="text-muted">Habitable Zone</span>
                    <span>
                      @if (p.habitableZone) {
                        <i class="bx bx-check text-success"></i> Yes
                      } @else {
                        <i class="bx bx-x text-muted"></i> No
                      }
                    </span>
                  </li>
                  <li class="d-flex justify-content-between py-2 border-bottom">
                    <span class="text-muted">Moon Count</span>
                    <span class="fw-medium">{{ p.moons.length }}</span>
                  </li>
                  <li class="d-flex justify-content-between py-2">
                    <span class="text-muted">Year Length</span>
                    <span class="fw-medium">{{ (p.orbitalPeriod / 365).toFixed(2) }} Earth years</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Relationship Summary -->
            <div class="card">
              <div class="card-header">
                <h6 class="mb-0">
                  <i class="bx bx-git-branch me-2"></i>
                  Relationships
                </h6>
              </div>
              <div class="card-body">
                <div class="relationship-list">
                  <div class="relationship-item mb-3">
                    <div class="d-flex align-items-center text-warning mb-1">
                      <i class="bx bx-sun me-2"></i>
                      <strong>*-1 Star</strong>
                    </div>
                    <small class="text-muted">Orbits {{ getStarName(p.orbitsStarId) }}</small>
                  </div>
                  <div class="relationship-item mb-3">
                    <div class="d-flex align-items-center text-info mb-1">
                      <i class="bx bx-cloud me-2"></i>
                      <strong>1-1 Atmosphere</strong>
                    </div>
                    <small class="text-muted">
                      {{ p.atmosphere ? p.atmosphere.type.name : 'None' }}
                    </small>
                  </div>
                  <div class="relationship-item">
                    <div class="d-flex align-items-center text-secondary mb-1">
                      <i class="bx bx-moon me-2"></i>
                      <strong>1-* Moons</strong>
                    </div>
                    <small class="text-muted">{{ p.moons.length }} natural satellites</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="alert alert-warning">
          Planet not found
        </div>
      }
    </div>
  `,
  styles: [`
    .planet-read {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .property-item {
      padding: 0.5rem;
      background: var(--vz-light);
      border-radius: 8px;
      height: 100%;
    }
    
    .relationship-item {
      padding: 0.75rem;
      background: var(--vz-light);
      border-radius: 8px;
    }
  `]
})
export class PlanetReadComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(AstronomyService);
  
  loading = signal(true);
  planet = signal<Planet | null>(null);
  parentSystem = signal<StarSystem | null>(null);
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getPlanet(id).subscribe(p => {
        this.planet.set(p || null);
        this.loading.set(false);
        
        // Load parent system for star name lookup
        if (p) {
          this.service.getStarSystems().subscribe(systems => {
            const sys = systems.find(s => s.planets.some(pl => pl.id === id));
            this.parentSystem.set(sys || null);
          });
        }
      });
    } else {
      this.loading.set(false);
    }
  }
  
  getStarName(starId: string): string {
    const sys = this.parentSystem();
    if (sys) {
      const star = sys.stars.find(s => s.id === starId);
      return star?.name || starId;
    }
    return starId;
  }
}
