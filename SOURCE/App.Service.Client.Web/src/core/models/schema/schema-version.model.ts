/**
 * Schema Versioning
 * 
 * Provides version management for schema DSL evolution.
 * Each major version can have its own parser/interpreter.
 * 
 * VERSIONING STRATEGY:
 * - Major: Breaking changes to schema structure
 * - Minor: New features, backward compatible
 * - Patch: Bug fixes in parsing/interpretation
 * 
 * When loading a schema:
 * 1. Read dslVersion
 * 2. Select appropriate parser from registry
 * 3. Parse/validate with that version's rules
 * 4. Optionally migrate to latest
 */

// ═══════════════════════════════════════════════════════════════════
// Version Constants
// ═══════════════════════════════════════════════════════════════════

/** Current DSL version */
export const CURRENT_DSL_VERSION = '1.0.0';

/** Minimum supported version (older will fail) */
export const MIN_SUPPORTED_VERSION = '1.0.0';

/** Versions that can be auto-migrated to current */
export const MIGRATABLE_VERSIONS = ['1.0.0'];

// ═══════════════════════════════════════════════════════════════════
// Version Types
// ═══════════════════════════════════════════════════════════════════

/**
 * Parsed semantic version
 */
export interface SemanticVersion {
  major: number;
  minor: number;
  patch: number;
  raw: string;
}

/**
 * Base interface for all versioned schemas
 */
export interface VersionedSchema {
  /** DSL version this schema was created with */
  dslVersion: string;
}

/**
 * Result of version check
 */
export interface VersionCheckResult {
  isValid: boolean;
  isCurrentVersion: boolean;
  needsMigration: boolean;
  canMigrate: boolean;
  currentVersion: string;
  schemaVersion: string;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════
// Version Parsing
// ═══════════════════════════════════════════════════════════════════

/**
 * Parse a semantic version string
 */
export function parseVersion(version: string): SemanticVersion | null {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    return null;
  }
  
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    raw: version,
  };
}

/**
 * Compare two versions
 * Returns: -1 if a < b, 0 if equal, 1 if a > b
 */
export function compareVersions(a: string, b: string): number {
  const va = parseVersion(a);
  const vb = parseVersion(b);
  
  if (!va || !vb) {
    return 0; // Can't compare invalid versions
  }
  
  if (va.major !== vb.major) return va.major - vb.major;
  if (va.minor !== vb.minor) return va.minor - vb.minor;
  return va.patch - vb.patch;
}

/**
 * Check if version is supported
 */
export function isVersionSupported(version: string): boolean {
  return compareVersions(version, MIN_SUPPORTED_VERSION) >= 0;
}

/**
 * Check if version needs migration
 */
export function needsMigration(version: string): boolean {
  return compareVersions(version, CURRENT_DSL_VERSION) < 0;
}

/**
 * Check if version can be migrated
 */
export function canMigrate(version: string): boolean {
  return MIGRATABLE_VERSIONS.includes(version);
}

/**
 * Comprehensive version check
 */
export function checkVersion(schemaVersion: string | undefined): VersionCheckResult {
  const version = schemaVersion || '1.0.0';
  const parsed = parseVersion(version);
  
  if (!parsed) {
    return {
      isValid: false,
      isCurrentVersion: false,
      needsMigration: false,
      canMigrate: false,
      currentVersion: CURRENT_DSL_VERSION,
      schemaVersion: version,
      error: `Invalid version format: ${version}. Expected semver (e.g., 1.0.0)`,
    };
  }
  
  if (!isVersionSupported(version)) {
    return {
      isValid: false,
      isCurrentVersion: false,
      needsMigration: false,
      canMigrate: false,
      currentVersion: CURRENT_DSL_VERSION,
      schemaVersion: version,
      error: `Version ${version} is no longer supported. Minimum: ${MIN_SUPPORTED_VERSION}`,
    };
  }
  
  const requiresMigration = needsMigration(version);
  const migrationPossible = canMigrate(version);
  
  return {
    isValid: true,
    isCurrentVersion: version === CURRENT_DSL_VERSION,
    needsMigration: requiresMigration,
    canMigrate: requiresMigration ? migrationPossible : true,
    currentVersion: CURRENT_DSL_VERSION,
    schemaVersion: version,
    error: requiresMigration && !migrationPossible 
      ? `Version ${version} cannot be auto-migrated to ${CURRENT_DSL_VERSION}`
      : undefined,
  };
}

// ═══════════════════════════════════════════════════════════════════
// Parser Registry
// ═══════════════════════════════════════════════════════════════════

/**
 * Schema parser interface
 * Each version can have its own parser implementation
 */
export interface SchemaParser<T> {
  /** Version this parser handles */
  version: string;
  
  /** Parse and validate schema */
  parse(input: unknown): ParseResult<T>;
  
  /** Migrate from this version to next version */
  migrateUp?(schema: T): T;
}

/**
 * Result of parsing
 */
export interface ParseResult<T> {
  success: boolean;
  data?: T;
  errors: ParseError[];
  warnings: ParseWarning[];
}

/**
 * Parse error with location
 */
export interface ParseError {
  code: string;
  message: string;
  path: string;  // JSON path to error location
  value?: unknown;
}

/**
 * Parse warning (non-fatal)
 */
export interface ParseWarning {
  code: string;
  message: string;
  path: string;
}

/**
 * Parser registry for managing version-specific parsers
 */
export class SchemaParserRegistry<T> {
  private parsers = new Map<string, SchemaParser<T>>();
  private majorParsers = new Map<number, SchemaParser<T>>();
  
  /**
   * Register a parser for a specific version
   */
  register(parser: SchemaParser<T>): void {
    this.parsers.set(parser.version, parser);
    
    // Also register as major version handler (latest wins)
    const parsed = parseVersion(parser.version);
    if (parsed) {
      this.majorParsers.set(parsed.major, parser);
    }
  }
  
  /**
   * Get parser for a specific version
   * Falls back to major version parser if exact not found
   */
  getParser(version: string): SchemaParser<T> | undefined {
    // Exact match
    const exact = this.parsers.get(version);
    if (exact) return exact;
    
    // Major version fallback
    const parsed = parseVersion(version);
    if (parsed) {
      return this.majorParsers.get(parsed.major);
    }
    
    return undefined;
  }
  
  /**
   * Parse schema with appropriate version parser
   */
  parse(input: unknown, version?: string): ParseResult<T> {
    const v = version || CURRENT_DSL_VERSION;
    const parser = this.getParser(v);
    
    if (!parser) {
      return {
        success: false,
        errors: [{
          code: 'UNSUPPORTED_VERSION',
          message: `No parser available for version ${v}`,
          path: 'dslVersion',
        }],
        warnings: [],
      };
    }
    
    return parser.parse(input);
  }
  
  /**
   * Migrate schema to current version
   */
  migrate(schema: T, fromVersion: string): T {
    let current = schema;
    let currentVersion = fromVersion;
    
    while (compareVersions(currentVersion, CURRENT_DSL_VERSION) < 0) {
      const parser = this.getParser(currentVersion);
      if (!parser?.migrateUp) {
        throw new Error(`Cannot migrate from ${currentVersion}: no migration path`);
      }
      
      current = parser.migrateUp(current);
      
      // Increment minor version (simplified - real impl would track actual migrations)
      const parsed = parseVersion(currentVersion);
      if (parsed) {
        currentVersion = `${parsed.major}.${parsed.minor + 1}.0`;
      } else {
        break;
      }
    }
    
    return current;
  }
}

// ═══════════════════════════════════════════════════════════════════
// Helper to add version to schema
// ═══════════════════════════════════════════════════════════════════

/**
 * Ensure schema has dslVersion, adding current if missing
 */
export function ensureVersion<T extends Partial<VersionedSchema>>(schema: T): T & VersionedSchema {
  if (!schema.dslVersion) {
    return { ...schema, dslVersion: CURRENT_DSL_VERSION };
  }
  return schema as T & VersionedSchema;
}

/**
 * Create a versioned schema
 */
export function versioned<T>(schema: T): T & VersionedSchema {
  return { ...schema, dslVersion: CURRENT_DSL_VERSION };
}
