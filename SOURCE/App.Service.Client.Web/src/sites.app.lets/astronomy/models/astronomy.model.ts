/**
 * Astronomy Domain Models
 * 
 * Demonstrates all relationship types:
 * - 1-* : StarSystem → Stars, StarSystem → Planets, Planet → Moons
 * - *-* : Star ↔ Constellation
 * - *-1 : Planet → Star (orbits)
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
 * Constellation - Reference entity for *-* relationship with Stars
 */
export interface Constellation {
  id: string;
  name: string;
  starCount: number;
  mythology: string;
}

/**
 * Star - 1-* child of StarSystem, *-* with Constellation
 */
export interface Star {
  id: string;
  name: string;
  type: StarType;
  mass: number; // Solar masses
  radius: number; // Solar radii
  luminosity: number; // Solar luminosity
  constellations: Constellation[]; // *-* relationship
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
 * Contains: 1-* Stars, 1-* Planets
 */
export interface StarSystem {
  id: string;
  name: string;
  description: string;
  
  // Discovery metadata
  discoveredAt: Date;
  discoveredBy: string;
  distanceFromEarth: number; // Light years
  
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
