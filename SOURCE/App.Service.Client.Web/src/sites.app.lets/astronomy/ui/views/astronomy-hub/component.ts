/**
 * Astronomy Hub Component
 * 
 * Landing page for the Astronomy applet showing overview stats and navigation.
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageHeaderComponent } from '../../../../../sites/ui/widgets/page-header';
import { BaseCoreAgPipesModule } from '../../../../../core.ag/pipes/module';
import { AstronomyService } from '../../../services/astronomy.service';

@Component({
  selector: 'app-astronomy-hub',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent, BaseCoreAgPipesModule],
  template: `
    <div class="astronomy-hub">
      <!-- Page Header -->
      <app-page-header 
        title="Astronomy"
        icon="bx-planet"
        iconBackground="bg-primary-subtle"
        iconClass="text-primary"
        [showBack]="false">
        <ng-container subtitle>
          Explore star systems, planets, and moons
        </ng-container>
      </app-page-header>

      <!-- Stats Cards -->
      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <div class="card stats-card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="stat-icon bg-warning-subtle text-warning me-3">
                  <i class="bx bx-sun"></i>
                </div>
                <div>
                  <h3 class="mb-0">{{ service.starSystemCount() }}</h3>
                  <p class="text-muted mb-0">Star Systems</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card stats-card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="stat-icon bg-info-subtle text-info me-3">
                  <i class="bx bx-planet"></i>
                </div>
                <div>
                  <h3 class="mb-0">{{ service.planetCount() }}</h3>
                  <p class="text-muted mb-0">Planets</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card stats-card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="stat-icon bg-success-subtle text-success me-3">
                  <i class="bx bx-check-circle"></i>
                </div>
                <div>
                  <h3 class="mb-0">{{ habitablePlanets }}</h3>
                  <p class="text-muted mb-0">Habitable Zone</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tiles -->
      <div class="row g-3">
        <div class="col-md-6">
          <a routerLink="star-systems" class="nav-tile card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="tile-icon bg-warning-subtle me-3">
                  <i class="bx bx-sun text-warning"></i>
                </div>
                <div class="flex-grow-1">
                  <h5 class="mb-1">Star Systems</h5>
                  <p class="text-muted mb-0">Browse star systems and their components</p>
                </div>
                <i class="bx bx-chevron-right text-muted"></i>
              </div>
            </div>
          </a>
        </div>
        <div class="col-md-6">
          <a routerLink="planets" class="nav-tile card h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="tile-icon bg-info-subtle me-3">
                  <i class="bx bx-planet text-info"></i>
                </div>
                <div class="flex-grow-1">
                  <h5 class="mb-1">Planets</h5>
                  <p class="text-muted mb-0">Explore all known planets</p>
                </div>
                <i class="bx bx-chevron-right text-muted"></i>
              </div>
            </div>
          </a>
        </div>
      </div>

      <!-- Relationship Diagram (for demo purposes) -->
      <div class="card mt-4">
        <div class="card-header">
          <h6 class="mb-0">
            <i class="bx bx-git-branch me-2"></i>
            Domain Model Relationships
          </h6>
        </div>
        <div class="card-body">
          <pre class="mb-0 text-muted small"><code>StarSystem (Aggregate Root)
├── *-* Astronomers (discoverers - many credited per system)
├── 1-* Stars
│   └── *-1 Constellation (IAU boundary - one per star)
├── 1-* Planets
│   ├── *-1 Star (orbits)
│   ├── 1-1 Atmosphere
│   └── 1-* Moons
└── discoveredAt (value object)</code></pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .astronomy-hub {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .stats-card {
      transition: all 0.2s ease;
      border: 1px solid var(--vz-border-color);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }
    
    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
    }
    
    .nav-tile {
      text-decoration: none;
      color: inherit;
      transition: all 0.2s ease;
      border: 1px solid var(--vz-border-color);
      
      &:hover {
        border-color: var(--vz-primary);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }
    
    .tile-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    
    pre {
      background: var(--vz-light);
      padding: 1rem;
      border-radius: 8px;
    }
  `]
})
export class AstronomyHubComponent {
  service = inject(AstronomyService);
  
  get habitablePlanets(): number {
    return this.service.starSystems()
      .flatMap(s => s.planets)
      .filter(p => p.habitableZone).length;
  }
}
