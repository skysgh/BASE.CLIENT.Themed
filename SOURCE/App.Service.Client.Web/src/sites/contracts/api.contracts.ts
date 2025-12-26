/**
 * Site API Endpoint Contracts
 * 
 * Defines the interface for API endpoints needed by Sites tier components.
 * 
 * ARCHITECTURE:
 * - Sites tier defines contracts (what APIs it needs)
 * - Apps.Main provides implementation (concrete URLs)
 * - Sites components consume via DI (injection)
 * 
 * RATIONALE FOR PLACEMENT:
 * - Sites components make API calls, so Sites defines the contract
 * - Follows "consumer defines interface" SOLID principle
 * - Avoids CLI-managed apps/ directory (safe from scaffolding overwrites)
 * - Enables Sites extraction as reusable library
 * 
 * USAGE:
 * ```typescript
 * // In service:
 * import { ApiEndpoints } from '../../contracts';
 * constructor(@Inject(API_ENDPOINTS) private apis: ApiEndpoints) {}
 * 
 * // Make API call:
 * this.http.get(this.apis.brochure.capabilities)
 * ```
 */

/**
 * Brochure/Marketing API endpoints
 * Used for landing pages, feature lists, etc.
 */
export interface ApiBrochureEndpoints {
  /** Get service features */
  feature: string;
  /** Get available languages */
  languages: string;
  /** Get service capabilities */
  capabilities: string;
  /** Get service statistics */
  stats: string;
  /** Get trusted partners/clients */
  trustedBy: string;
  /** Get user endorsements/testimonials */
  endorsements: string;
  /** Get FAQs */
  faqs: string;
  /** Get FAQ categories */
  faqsCategories: string;
  /** Get delivery team members */
  deliveryTeamMembers: string;
  /** Get job opportunities */
  jobs: string;
}

/**
 * Person-related API endpoints
 */
export interface ApiPersonEndpoints {
  /** Base persons endpoint */
  root?: string;
  // Add specific person endpoints as needed
}

/**
 * Pricing-related API endpoints
 */
export interface ApiPricingEndpoints {
  /** Base pricing endpoint */
  root?: string;
  // Add specific pricing endpoints as needed
}

/**
 * Product-related API endpoints
 */
export interface ApiProductEndpoints {
  /** Base products endpoint */
  root?: string;
  // Add specific product endpoints as needed
}

/**
 * Service-related API endpoints
 */
export interface ApiServiceEndpoints {
  /** Base service endpoint */
  root?: string;
  // Add specific service endpoints as needed
}

/**
 * Complete API endpoint structure.
 * Consumed by Sites components, provided by Apps.Main.
 */
export interface ApiEndpoints {
  /** Brochure/marketing endpoints */
  brochure: ApiBrochureEndpoints;
  /** Person management endpoints */
  persons: ApiPersonEndpoints;
  /** Pricing information endpoints */
  pricing: ApiPricingEndpoints;
  /** Product catalog endpoints */
  products: ApiProductEndpoints;
  /** Service-related endpoints */
  service: ApiServiceEndpoints;
}
