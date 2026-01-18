/**
 * Astronomy Domain Models
 * 
 * Demonstrates all relationship types:
 * - 1-* : StarSystem → Stars, StarSystem → Planets, Planet → Moons
 * - *-* : StarSystem ↔ Astronomer (discovery credits)
 * - *-1 : Planet → Star (orbits), Star → Constellation (IAU boundary)
 * - 1-1 : Planet → Atmosphere
 */

// ========================================
// Reference Data Types
// ========================================

export interface StarType {
  id: string;
  name: string;
  color: string;
  temperature: string;
}

export interface PlanetType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface AtmosphereType {
  id: string;
  name: string;
  composition: string;
}

// ========================================
// Entities
// ========================================

/**
 * Constellation - Reference entity
 * Since 1928 IAU standardization, each star belongs to exactly ONE constellation.
 */
export interface Constellation {
  id: string;
  name: string;
  abbreviation: string;
  mythology: string;
}

/**
 * Astronomer - Entity for *-* relationship with StarSystem
 * Multiple astronomers can discover a system; one astronomer discovers multiple systems.
 */
export interface Astronomer {
  id: string;
  name: string;
  affiliation: string;
  country: string;
  specialization: string;
}

/**
 * Star - 1-* child of StarSystem, *-1 to Constellation
 */
export interface Star {
  id: string;
  name: string;
  type: StarType;
  mass: number; // Solar masses
  radius: number; // Solar radii
  luminosity: number; // Solar luminosity
  constellation: Constellation | null; // *-1 relationship (each star in ONE constellation)
}

/**
 * Moon - 1-* child of Planet
 */
export interface Moon {
  id: string;
  name: string;
  radius: number; // Earth radii
  orbitalPeriod: number; // Days
  tidallyLocked: boolean;
}

/**
 * Atmosphere - 1-1 relationship with Planet
 */
export interface Atmosphere {
  id: string;
  type: AtmosphereType;
  pressure: number; // Earth atmospheres
  hasWeather: boolean;
}

/**
 * Planet - 1-* child of StarSystem, *-1 to Star (orbits), 1-1 to Atmosphere, 1-* to Moons
 */
export interface Planet {
  id: string;
  name: string;
  type: PlanetType;
  
  // *-1 relationship: many planets orbit one star
  orbitsStarId: string;
  
  // Physical properties
  distanceFromStar: number; // AU
  orbitalPeriod: number; // Days
  radius: number; // Earth radii
  mass: number; // Earth masses
  
  // 1-1 relationship
  atmosphere: Atmosphere | null;
  
  // 1-* relationship
  moons: Moon[];
  
  // Additional properties
  rings: boolean;
  habitableZone: boolean;
}

/**
 * StarSystem - Aggregate Root
 * Contains: 1-* Stars, 1-* Planets, *-* Astronomers
 */
export interface StarSystem {
  id: string;
  name: string;
  description: string;
  
  // Discovery metadata
  discoveredAt: Date;
  distanceFromEarth: number; // Light years
  
  // *-* relationship: multiple astronomers credited with discovery/study
  discoverers: Astronomer[];
  
  // 1-* relationships
  stars: Star[];
  planets: Planet[];
}

// ========================================
// View Models / DTOs
// ========================================

export interface StarSystemSummary {
  id: string;
  name: string;
  description: string;
  distanceFromEarth: number;
  starCount: number;
  planetCount: number;
  habitablePlanetCount: number;
}

export interface PlanetSummary {
  id: string;
  name: string;
  type: PlanetType;
  starSystemId: string;
  starSystemName: string;
  moonCount: number;
  habitableZone: boolean;
}
