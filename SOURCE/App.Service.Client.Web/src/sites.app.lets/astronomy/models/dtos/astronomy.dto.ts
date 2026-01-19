/**
 * Star System DTO
 * 
 * Data Transfer Object representing a star system from the API.
 * This is the raw shape from json-server / backend API.
 */
export interface StarSystemDto {
  id: string;
  name: string;
  description?: string;
  distanceLightYears: number;
  discoveryDate?: string;
  discoveredBy?: string;
  starType?: string;
  createdUtc?: string;
  modifiedUtc?: string;
}

/**
 * Planet DTO
 * 
 * Data Transfer Object representing a planet from the API.
 * Links to a star system via starSystemId.
 */
export interface PlanetDto {
  id: string;
  starSystemId: string;
  name: string;
  description?: string;
  planetType?: string;
  distanceFromStar?: number;
  orbitalPeriodDays?: number;
  hasAtmosphere?: boolean | null;
  atmosphereType?: string | null;
  createdUtc?: string;
  modifiedUtc?: string;
}

/**
 * Astronomer DTO
 * 
 * Data Transfer Object representing an astronomer from the API.
 */
export interface AstronomerDto {
  id: string;
  name: string;
  affiliation?: string;
  country?: string;
  specialization?: string;
  createdUtc?: string;
  modifiedUtc?: string;
}
