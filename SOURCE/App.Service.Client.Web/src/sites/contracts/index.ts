/**
 * Sites Contracts
 * 
 * Central export for all contract interfaces defined by Sites tier.
 */


// API Contracts
export * from './api.contracts';

// Navigation Contracts (Security-classified)
export * from './public-navigation.contracts';   // ✅ NEW: Public (no auth)
export * from './private-navigation.contracts';  // ✅ NEW: Private (auth required, includes public)
export * from './navigation.contracts';          // ⚠️  LEGACY: For backward compatibility

// Resource Contracts (Security-classified)
export * from './deployed-resource.contracts';   // Static, safe, CDN-friendly
export * from './uploaded-resource.contracts';   // User-generated, high-risk
export * from './resource.contracts';            // ⚠️  LEGACY: For backward compatibility
