/**
 * Astronomy Service
 * 
 * Signal-based service providing reactive state management for Star Systems.
 * Uses repository pattern for HTTP communication with json-server.
 * 
 * Architecture: Repository (HTTP) → Service (signals) → Component
 */
import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { 
  StarSystem, 
  Star, 
  Planet, 
  Moon, 
  Constellation,
  Astronomer,
  StarType,
  PlanetType,
  AtmosphereType 
} from '../models';
import { StarSystemRepository, PlanetRepository } from '../repositories';
import { StarSystemDto, PlanetDto } from '../models/dtos';
import { SystemDiagnosticsTraceService } from '../../../core/services/system.diagnostics-trace.service';

@Injectable({ providedIn: 'root' })
export class AstronomyService {
  private repository = inject(StarSystemRepository);
  private planetRepository = inject(PlanetRepository);
  private logger = inject(SystemDiagnosticsTraceService);
  
  // Signals for reactive state
  private _starSystems = signal<StarSystem[]>([]);
  private _planets = signal<Planet[]>([]);
  private _loading = signal(false);
  private _saving = signal(false);
  private _error = signal<string | null>(null);
  
  // Public readonly
  readonly starSystems = this._starSystems.asReadonly();
  readonly planets = this._planets.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly saving = this._saving.asReadonly();
  readonly error = this._error.asReadonly();
  
  // Computed
  readonly starSystemCount = computed(() => this._starSystems().length);
  readonly planetCount = computed(() => this._planets().length);
  
  constructor() {
    this.logger.debug('AstronomyService initialized');
    this.loadStarSystems();
  }
  
  // ========================================
  // Star Systems - API-backed
  // ========================================
  
  /**
   * Load all star systems from API
   */
  loadStarSystems(): void {
    this._loading.set(true);
    this._error.set(null);
    
    this.repository.getAll().pipe(
      tap({
        next: (dtos) => {
          const viewModels = dtos.map(dto => this.mapDtoToStarSystem(dto));
          this._starSystems.set(viewModels);
          this._loading.set(false);
          this.logger.debug(`Loaded ${viewModels.length} star systems from API`);
        },
        error: (err) => {
          this._error.set('Failed to load star systems');
          this._loading.set(false);
          this.logger.error(`Error loading star systems: ${err?.message || err}`);
        }
      })
    ).subscribe();
  }
  
  /**
   * Get star systems (returns current signal value)
   */
  getStarSystems(): Observable<StarSystem[]> {
    // If already loaded, return signal value
    if (this._starSystems().length > 0) {
      return of(this._starSystems());
    }
    // Otherwise fetch from API
    return this.repository.getAll().pipe(
      map(dtos => dtos.map(dto => this.mapDtoToStarSystem(dto))),
      tap(systems => this._starSystems.set(systems))
    );
  }
  
  /**
   * Get star system by ID
   */
  getStarSystem(id: string): Observable<StarSystem | undefined> {
    // Check cache first
    const cached = this._starSystems().find(s => s.id === id);
    if (cached) {
      return of(cached);
    }
    // Fetch from API
    return this.repository.getById(id).pipe(
      map(dto => this.mapDtoToStarSystem(dto)),
      catchError(() => of(undefined))
    );
  }
  
  /**
   * Update a star system (persists to json-server)
   */
  updateStarSystem(id: string, updates: Partial<StarSystem>): Observable<StarSystem | undefined> {
    this._saving.set(true);
    
    // Build DTO for update
    const existing = this._starSystems().find(s => s.id === id);
    if (!existing) {
      this._saving.set(false);
      return of(undefined);
    }
    
    const dto: StarSystemDto = {
      ...this.mapStarSystemToDto(existing),
      ...this.mapPartialToDto(updates),
      modifiedUtc: new Date().toISOString(),
    };
    
    return this.repository.update(id, dto).pipe(
      map(savedDto => this.mapDtoToStarSystem(savedDto)),
      tap({
        next: (updated) => {
          // Update local cache
          this._starSystems.update(systems => 
            systems.map(s => s.id === id ? updated : s)
          );
          this._saving.set(false);
          this.logger.debug(`Updated star system: ${updated.name}`);
        },
        error: (err) => {
          this._error.set('Failed to update star system');
          this._saving.set(false);
          this.logger.error(`Error updating star system: ${err?.message || err}`);
        }
      }),
      catchError(() => of(undefined))
    );
  }
  
  /**
   * Create a new star system (persists to json-server)
   */
  createStarSystem(data: Partial<StarSystem>): Observable<StarSystem> {
    this._saving.set(true);
    
    const now = new Date().toISOString();
    const dto: StarSystemDto = {
      id: `sys-${Date.now()}`,
      name: data.name || 'New Star System',
      description: data.description,
      distanceLightYears: data.distanceFromEarth || 0,
      discoveryDate: data.discoveredAt?.toISOString(),
      starType: undefined,
      createdUtc: now,
      modifiedUtc: now,
    };
    
    return this.repository.create(dto).pipe(
      map(savedDto => this.mapDtoToStarSystem(savedDto)),
      tap({
        next: (created) => {
          this._starSystems.update(systems => [...systems, created]);
          this._saving.set(false);
          this.logger.debug(`Created star system: ${created.name}`);
        },
        error: (err) => {
          this._error.set('Failed to create star system');
          this._saving.set(false);
          this.logger.error(`Error creating star system: ${err?.message || err}`);
        }
      })
    );
  }
  
  /**
   * Delete a star system (persists to json-server)
   */
  deleteStarSystem(id: string): Observable<boolean> {
    this._saving.set(true);
    
    return this.repository.delete(id).pipe(
      map(() => true),
      tap({
        next: () => {
          this._starSystems.update(systems => systems.filter(s => s.id !== id));
          this._saving.set(false);
          this.logger.debug(`Deleted star system: ${id}`);
        },
        error: (err) => {
          this._error.set('Failed to delete star system');
          this._saving.set(false);
          this.logger.error(`Error deleting star system: ${err?.message || err}`);
        }
      }),
      catchError(() => of(false))
    );
  }
  
  // ========================================
  // Planets - API-backed
  // ========================================
  
  /**
   * Get planets for a star system
   */
  getPlanetsInSystem(starSystemId: string): Observable<Planet[]> {
    return this.planetRepository.getByStarSystemId(starSystemId).pipe(
      map(dtos => dtos.map(dto => this.mapDtoToPlanet(dto)))
    );
  }
  
  /**
   * Get all planets
   */
  getAllPlanets(): Observable<Planet[]> {
    return this.planetRepository.getAll().pipe(
      map(dtos => dtos.map(dto => this.mapDtoToPlanet(dto))),
      tap(planets => this._planets.set(planets))
    );
  }
  
  /**
   * Get planet by ID
   */
  getPlanet(id: string): Observable<Planet | undefined> {
    return this.planetRepository.getById(id).pipe(
      map(dto => this.mapDtoToPlanet(dto)),
      catchError(() => of(undefined))
    );
  }
  
  // ========================================
  // Mappers (DTO ↔ ViewModel)
  // ========================================
  
  private mapDtoToStarSystem(dto: StarSystemDto): StarSystem {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description || '',
      distanceFromEarth: dto.distanceLightYears,
      discoveredAt: dto.discoveryDate ? new Date(dto.discoveryDate) : new Date(),
      discoverers: [],
      planets: [],
      stars: [],
    };
  }
  
  private mapStarSystemToDto(system: StarSystem): StarSystemDto {
    return {
      id: system.id,
      name: system.name,
      description: system.description,
      distanceLightYears: system.distanceFromEarth || 0,
      discoveryDate: system.discoveredAt?.toISOString(),
    };
  }
  
  private mapPartialToDto(updates: Partial<StarSystem>): Partial<StarSystemDto> {
    const dto: Partial<StarSystemDto> = {};
    if (updates.name !== undefined) dto.name = updates.name;
    if (updates.description !== undefined) dto.description = updates.description;
    if (updates.distanceFromEarth !== undefined) dto.distanceLightYears = updates.distanceFromEarth;
    if (updates.discoveredAt !== undefined) dto.discoveryDate = updates.discoveredAt?.toISOString();
    return dto;
  }
  
  private mapDtoToPlanet(dto: PlanetDto): Planet {
    return {
      id: dto.id,
      name: dto.name,
      type: { id: dto.planetType || 'rocky', name: dto.planetType || 'Rocky', icon: 'bx-circle', description: '' },
      orbitsStarId: dto.starSystemId,
      distanceFromStar: dto.distanceFromStar || 0,
      orbitalPeriod: dto.orbitalPeriodDays || 0,
      radius: 1,
      mass: 1,
      atmosphere: null,
      moons: [],
      rings: false,
      habitableZone: false,
    };
  }
  
  // ========================================
  // Reference Data (static)
  // ========================================
  
  getStarTypes(): StarType[] {
    return STAR_TYPES;
  }
  
  getPlanetTypes(): PlanetType[] {
    return PLANET_TYPES;
  }
  
  getAtmosphereTypes(): AtmosphereType[] {
    return ATMOSPHERE_TYPES;
  }
  
  getConstellations(): Constellation[] {
    return CONSTELLATIONS;
  }
}

// ========================================
// Reference Data
// ========================================

const STAR_TYPES: StarType[] = [
  { id: 'red-dwarf', name: 'Red Dwarf', color: '#FF6B6B', temperature: '2,500-4,000 K' },
  { id: 'yellow-dwarf', name: 'Yellow Dwarf', color: '#FFD93D', temperature: '5,000-6,000 K' },
  { id: 'blue-giant', name: 'Blue Giant', color: '#6BCBFF', temperature: '10,000-30,000 K' },
  { id: 'white-dwarf', name: 'White Dwarf', color: '#FFFFFF', temperature: '8,000-40,000 K' },
  { id: 'red-giant', name: 'Red Giant', color: '#FF8C42', temperature: '3,500-5,000 K' },
  { id: 'neutron', name: 'Neutron Star', color: '#9B59B6', temperature: '600,000+ K' },
];

const PLANET_TYPES: PlanetType[] = [
  { id: 'rocky', name: 'Rocky', icon: 'bx-circle', description: 'Solid surface, like Earth or Mars' },
  { id: 'gas-giant', name: 'Gas Giant', icon: 'bx-radio-circle', description: 'Massive, no solid surface, like Jupiter' },
  { id: 'ice-giant', name: 'Ice Giant', icon: 'bx-radio-circle-marked', description: 'Icy composition, like Neptune' },
  { id: 'dwarf', name: 'Dwarf Planet', icon: 'bx-radio-circle', description: 'Small, like Pluto' },
];

const ATMOSPHERE_TYPES: AtmosphereType[] = [
  { id: 'none', name: 'None', composition: 'N/A' },
  { id: 'nitrogen', name: 'Nitrogen-Oxygen', composition: 'N₂, O₂' },
  { id: 'carbon-dioxide', name: 'Carbon Dioxide', composition: 'CO₂' },
  { id: 'hydrogen', name: 'Hydrogen-Helium', composition: 'H₂, He' },
  { id: 'methane', name: 'Methane', composition: 'CH₄' },
];

const CONSTELLATIONS: Constellation[] = [
  { id: 'orion', name: 'Orion', abbreviation: 'Ori', mythology: 'The Hunter' },
  { id: 'ursa-major', name: 'Ursa Major', abbreviation: 'UMa', mythology: 'The Great Bear' },
  { id: 'cassiopeia', name: 'Cassiopeia', abbreviation: 'Cas', mythology: 'The Queen' },
  { id: 'scorpius', name: 'Scorpius', abbreviation: 'Sco', mythology: 'The Scorpion' },
  { id: 'centaurus', name: 'Centaurus', abbreviation: 'Cen', mythology: 'The Centaur' },
  { id: 'aquarius', name: 'Aquarius', abbreviation: 'Aqr', mythology: 'The Water Bearer' },
];

/**
 * Astronomers - for *-* relationship with StarSystem
 */
const ASTRONOMERS: Astronomer[] = [
  { id: 'copernicus', name: 'Nicolaus Copernicus', affiliation: 'University of Kraków', country: 'Poland', specialization: 'Heliocentrism' },
  { id: 'innes', name: 'Robert Innes', affiliation: 'Union Observatory', country: 'South Africa', specialization: 'Double stars' },
  { id: 'gillon', name: 'Michaël Gillon', affiliation: 'University of Liège', country: 'Belgium', specialization: 'Exoplanets' },
  { id: 'delrez', name: 'Laetitia Delrez', affiliation: 'University of Liège', country: 'Belgium', specialization: 'Exoplanets' },
  { id: 'triaud', name: 'Amaury Triaud', affiliation: 'University of Birmingham', country: 'UK', specialization: 'Exoplanets' },
  { id: 'anglada', name: 'Guillem Anglada-Escudé', affiliation: 'Queen Mary University', country: 'Spain/UK', specialization: 'Exoplanets' },
];


// Note: MOCK_STAR_SYSTEMS removed - data now loaded from json-server via StarSystemRepository

