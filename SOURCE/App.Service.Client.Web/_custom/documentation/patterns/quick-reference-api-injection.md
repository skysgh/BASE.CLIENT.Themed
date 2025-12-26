# API Injection Pattern - Quick Reference

**Pattern**: DI-Based API Endpoint Configuration  
**Tier**: Sites → Apps.Main  
**Time to Implement**: ~5 minutes per service

---

## Quick Usage

### In Service

```typescript
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS, ApiEndpoints } from '../../tokens';

@Injectable()
export class BrochureService {
  constructor(
    @Inject(API_ENDPOINTS) private apis: ApiEndpoints,
    private http: HttpClient
  ) {}
  
  getCapabilities() {
    return this.http.get(this.apis.brochure.capabilities);
  }
  
  getEndorsements() {
    return this.http.get(this.apis.brochure.endorsements);
  }
  
  getFaqs() {
    return this.http.get(this.apis.brochure.faqs);
  }
}
```

### In Component

```typescript
import { Component, Inject } from '@angular/core';
import { API_ENDPOINTS, ApiEndpoints } from '../../tokens';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-capabilities',
  templateUrl: './component.html'
})
export class CapabilitiesComponent {
  capabilities$ = this.http.get(this.apis.brochure.capabilities);
  
  constructor(
    @Inject(API_ENDPOINTS) private apis: ApiEndpoints,
    private http: HttpClient
  ) {}
}
```

---

## Available Endpoints

```typescript
apis.brochure.feature          // Service features
apis.brochure.languages        // Available languages
apis.brochure.capabilities     // Service capabilities
apis.brochure.stats            // Service statistics
apis.brochure.trustedBy        // Trusted partners
apis.brochure.endorsements     // User testimonials
apis.brochure.faqs             // FAQs
apis.brochure.faqsCategories   // FAQ categories
apis.brochure.deliveryTeamMembers  // Team members
apis.brochure.jobs             // Job opportunities

apis.persons.root              // Person endpoints
apis.pricing.root              // Pricing endpoints
apis.products.root             // Product endpoints
apis.service.root              // Service endpoints
```

---

## Testing

```typescript
import { TestBed } from '@angular/core/testing';
import { API_ENDPOINTS } from '../../tokens';

const mockApis = {
  brochure: {
    capabilities: '/test/api/capabilities',
    endorsements: '/test/api/endorsements',
    // ... other endpoints
  },
  persons: { root: '/test/api/persons' },
  pricing: { root: '/test/api/pricing' },
  products: { root: '/test/api/products' },
  service: { root: '/test/api/service' }
};

TestBed.configureTestingModule({
  providers: [
    { provide: API_ENDPOINTS, useValue: mockApis }
  ]
});
```

---

## Benefits

- ✅ No hardcoded API URLs
- ✅ Centralized endpoint management
- ✅ Easy to mock for testing
- ✅ Environment-specific URLs
- ✅ Type-safe autocomplete

---

## Pattern Files

- **Contract**: `sites/contracts/api.contracts.ts`
- **Token**: `sites/tokens/api.tokens.ts`
- **Provider**: `apps.main/module.ts`
- **Constants**: `sites/constants/implementations/sites.constants.apis.ts`
