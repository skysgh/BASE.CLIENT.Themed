/**
 * Astronomy Service
 * 
 * Provides data access for celestial bodies.
 * Uses mock data for demonstration purposes.
 */
import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { 
  StarSystem, 
  Star, 
  Planet, 
  Moon, 
  Constellation,
  StarType,
  PlanetType,
  AtmosphereType 
} from '../models';

@Injectable({ providedIn: 'root' })
export class AstronomyService {
  
  // Signals for reactive state
  private _starSystems = signal<StarSystem[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  
  // Public readonly
  readonly starSystems = this._starSystems.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  
  // Computed
  readonly starSystemCount = computed(() => this._starSystems().length);
  readonly planetCount = computed(() => 
    this._starSystems().reduce((acc, sys) => acc + sys.planets.length, 0)
  );
  
  constructor() {
    this.loadMockData();
  }
  
  private loadMockData(): void {
    this._loading.set(true);
    
    // Simulate async load
    setTimeout(() => {
      this._starSystems.set(MOCK_STAR_SYSTEMS);
      this._loading.set(false);
    }, 500);
  }
  
  // ========================================
  // Star Systems
  // ========================================
  
  getStarSystems(): Observable<StarSystem[]> {
    return of(this._starSystems()).pipe(delay(100));
  }
  
  getStarSystem(id: string): Observable<StarSystem | undefined> {
    return of(this._starSystems().find(s => s.id === id)).pipe(delay(100));
  }
  
  // ========================================
  // Planets
  // ========================================
  
  getAllPlanets(): Observable<Planet[]> {
    const planets = this._starSystems().flatMap(sys => sys.planets);
    return of(planets).pipe(delay(100));
  }
  
  getPlanetsInSystem(systemId: string): Observable<Planet[]> {
    const system = this._starSystems().find(s => s.id === systemId);
    return of(system?.planets || []).pipe(delay(100));
  }
  
  getPlanet(id: string): Observable<Planet | undefined> {
    const planets = this._starSystems().flatMap(sys => sys.planets);
    return of(planets.find(p => p.id === id)).pipe(delay(100));
  }
  
  // ========================================
  // Reference Data
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
  { id: 'orion', name: 'Orion', starCount: 7, mythology: 'The Hunter' },
  { id: 'ursa-major', name: 'Ursa Major', starCount: 7, mythology: 'The Great Bear' },
  { id: 'cassiopeia', name: 'Cassiopeia', starCount: 5, mythology: 'The Queen' },
  { id: 'scorpius', name: 'Scorpius', starCount: 18, mythology: 'The Scorpion' },
  { id: 'centaurus', name: 'Centaurus', starCount: 11, mythology: 'The Centaur' },
];

// ========================================
// Mock Data
// ========================================

const MOCK_STAR_SYSTEMS: StarSystem[] = [
  {
    id: 'sol',
    name: 'Solar System',
    description: 'Our home star system, located in the Orion Arm of the Milky Way.',
    discoveredAt: new Date('1543-01-01'), // Copernicus
    discoveredBy: 'Ancient civilizations',
    distanceFromEarth: 0,
    stars: [
      {
        id: 'sun',
        name: 'Sol (The Sun)',
        type: STAR_TYPES[1], // Yellow Dwarf
        mass: 1.0, // Solar masses
        radius: 1.0, // Solar radii
        luminosity: 1.0,
        constellations: [],
      }
    ],
    planets: [
      {
        id: 'mercury',
        name: 'Mercury',
        type: PLANET_TYPES[0], // Rocky
        orbitsStarId: 'sun',
        distanceFromStar: 0.39,
        orbitalPeriod: 88,
        radius: 0.38,
        mass: 0.055,
        atmosphere: { id: 'atm-mercury', type: ATMOSPHERE_TYPES[0], pressure: 0, hasWeather: false },
        moons: [],
        rings: false,
        habitableZone: false,
      },
      {
        id: 'venus',
        name: 'Venus',
        type: PLANET_TYPES[0],
        orbitsStarId: 'sun',
        distanceFromStar: 0.72,
        orbitalPeriod: 225,
        radius: 0.95,
        mass: 0.815,
        atmosphere: { id: 'atm-venus', type: ATMOSPHERE_TYPES[2], pressure: 92, hasWeather: true },
        moons: [],
        rings: false,
        habitableZone: false,
      },
      {
        id: 'earth',
        name: 'Earth',
        type: PLANET_TYPES[0],
        orbitsStarId: 'sun',
        distanceFromStar: 1.0,
        orbitalPeriod: 365,
        radius: 1.0,
        mass: 1.0,
        atmosphere: { id: 'atm-earth', type: ATMOSPHERE_TYPES[1], pressure: 1, hasWeather: true },
        moons: [
          { id: 'moon', name: 'The Moon', radius: 0.27, orbitalPeriod: 27.3, tidallyLocked: true }
        ],
        rings: false,
        habitableZone: true,
      },
      {
        id: 'mars',
        name: 'Mars',
        type: PLANET_TYPES[0],
        orbitsStarId: 'sun',
        distanceFromStar: 1.52,
        orbitalPeriod: 687,
        radius: 0.53,
        mass: 0.107,
        atmosphere: { id: 'atm-mars', type: ATMOSPHERE_TYPES[2], pressure: 0.006, hasWeather: true },
        moons: [
          { id: 'phobos', name: 'Phobos', radius: 0.0017, orbitalPeriod: 0.32, tidallyLocked: true },
          { id: 'deimos', name: 'Deimos', radius: 0.0010, orbitalPeriod: 1.26, tidallyLocked: true }
        ],
        rings: false,
        habitableZone: false,
      },
      {
        id: 'jupiter',
        name: 'Jupiter',
        type: PLANET_TYPES[1], // Gas Giant
        orbitsStarId: 'sun',
        distanceFromStar: 5.2,
        orbitalPeriod: 4333,
        radius: 11.2,
        mass: 318,
        atmosphere: { id: 'atm-jupiter', type: ATMOSPHERE_TYPES[3], pressure: 1000, hasWeather: true },
        moons: [
          { id: 'io', name: 'Io', radius: 0.29, orbitalPeriod: 1.77, tidallyLocked: true },
          { id: 'europa', name: 'Europa', radius: 0.25, orbitalPeriod: 3.55, tidallyLocked: true },
          { id: 'ganymede', name: 'Ganymede', radius: 0.41, orbitalPeriod: 7.15, tidallyLocked: true },
          { id: 'callisto', name: 'Callisto', radius: 0.38, orbitalPeriod: 16.69, tidallyLocked: true },
        ],
        rings: true,
        habitableZone: false,
      },
      {
        id: 'saturn',
        name: 'Saturn',
        type: PLANET_TYPES[1],
        orbitsStarId: 'sun',
        distanceFromStar: 9.5,
        orbitalPeriod: 10759,
        radius: 9.4,
        mass: 95,
        atmosphere: { id: 'atm-saturn', type: ATMOSPHERE_TYPES[3], pressure: 1000, hasWeather: true },
        moons: [
          { id: 'titan', name: 'Titan', radius: 0.40, orbitalPeriod: 15.95, tidallyLocked: true },
          { id: 'enceladus', name: 'Enceladus', radius: 0.04, orbitalPeriod: 1.37, tidallyLocked: true },
        ],
        rings: true,
        habitableZone: false,
      },
    ],
  },
  {
    id: 'alpha-centauri',
    name: 'Alpha Centauri',
    description: 'The closest star system to our Solar System, a triple-star system.',
    discoveredAt: new Date('1915-01-01'),
    discoveredBy: 'Robert Innes',
    distanceFromEarth: 4.37,
    stars: [
      {
        id: 'alpha-centauri-a',
        name: 'Alpha Centauri A',
        type: STAR_TYPES[1],
        mass: 1.1,
        radius: 1.22,
        luminosity: 1.52,
        constellations: [CONSTELLATIONS[4]], // Centaurus
      },
      {
        id: 'alpha-centauri-b',
        name: 'Alpha Centauri B',
        type: STAR_TYPES[0], // Orange dwarf (using red for simplicity)
        mass: 0.9,
        radius: 0.86,
        luminosity: 0.5,
        constellations: [CONSTELLATIONS[4]],
      },
      {
        id: 'proxima-centauri',
        name: 'Proxima Centauri',
        type: STAR_TYPES[0], // Red Dwarf
        mass: 0.12,
        radius: 0.15,
        luminosity: 0.0017,
        constellations: [CONSTELLATIONS[4]],
      }
    ],
    planets: [
      {
        id: 'proxima-b',
        name: 'Proxima Centauri b',
        type: PLANET_TYPES[0],
        orbitsStarId: 'proxima-centauri',
        distanceFromStar: 0.05,
        orbitalPeriod: 11.2,
        radius: 1.1,
        mass: 1.27,
        atmosphere: null, // Unknown
        moons: [],
        rings: false,
        habitableZone: true,
      },
    ],
  },
  {
    id: 'trappist-1',
    name: 'TRAPPIST-1',
    description: 'An ultra-cool red dwarf with seven Earth-sized planets, three in habitable zone.',
    discoveredAt: new Date('2016-05-02'),
    discoveredBy: 'TRAPPIST telescope team',
    distanceFromEarth: 39.6,
    stars: [
      {
        id: 'trappist-1-star',
        name: 'TRAPPIST-1',
        type: STAR_TYPES[0], // Red Dwarf
        mass: 0.089,
        radius: 0.12,
        luminosity: 0.00052,
        constellations: [], // Aquarius
      }
    ],
    planets: [
      {
        id: 'trappist-1b',
        name: 'TRAPPIST-1b',
        type: PLANET_TYPES[0],
        orbitsStarId: 'trappist-1-star',
        distanceFromStar: 0.011,
        orbitalPeriod: 1.51,
        radius: 1.12,
        mass: 1.02,
        atmosphere: null,
        moons: [],
        rings: false,
        habitableZone: false,
      },
      {
        id: 'trappist-1e',
        name: 'TRAPPIST-1e',
        type: PLANET_TYPES[0],
        orbitsStarId: 'trappist-1-star',
        distanceFromStar: 0.029,
        orbitalPeriod: 6.1,
        radius: 0.92,
        mass: 0.77,
        atmosphere: null,
        moons: [],
        rings: false,
        habitableZone: true, // In habitable zone!
      },
    ],
  },
];
