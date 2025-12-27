/**
 * Testing Utilities and Helpers
 * 
 * Common mocks, test bed configurations, and utilities for writing tests.
 * 
 * Usage:
 * ```typescript
 * import { setupTestBed, MockAccountService } from '../../testing/test-helpers';
 * 
 * describe('MyComponent', () => {
 *   beforeEach(async () => {
 *     await setupTestBed([MyComponent]).compileComponents();
 *   });
 *   
 *   it('should create', () => {
 *     const fixture = TestBed.createComponent(MyComponent);
 *     expect(fixture.componentInstance).toBeTruthy();
 *   });
 * });
 * ```
 */

import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of, BehaviorSubject, Observable } from 'rxjs';

// Import types for mocking
import { AccountConfig } from '../core/models/account-config.model';

// ============================================================================
// MOCK SERVICES
// ============================================================================

/**
 * Mock AccountService
 * 
 * Provides fake account configuration for testing components that use AccountService.
 * 
 * Usage:
 * ```typescript
 * providers: [
 *   { provide: AccountService, useClass: MockAccountService }
 * ]
 * ```
 */
export class MockAccountService {
  private currentAccountSubject = new BehaviorSubject<AccountConfig | null>(this.getMockAccount());
  public currentAccount$ = this.currentAccountSubject.asObservable();

  /**
   * Get mock account configuration
   */
  private getMockAccount(): AccountConfig {
    return {
      id: 'test-account',
      subdomain: 'test',
      name: 'Test Account',
      branding: {
        logo: {
          light: '/mock/logo-light.svg',
          dark: '/mock/logo-dark.svg'
        },
        colors: {
          primary: '#007bff',
          secondary: '#6c757d'
        },
        theme: 'light'
      },
      i18n: {
        defaultLanguage: 'en',
        supportedLanguages: ['en'],
        namespaces: ['common']
      },
      features: {
        authentication: true,
        multiLanguage: true
      }
    };
  }

  /**
   * Get current account (synchronous)
   */
  getCurrentAccount(): AccountConfig | null {
    return this.currentAccountSubject.value;
  }

  /**
   * Get configuration value by path
   */
  getConfigValue(path: string): any {
    const account = this.getCurrentAccount();
    if (!account) return undefined;

    const keys = path.split('.');
    let value: any = account;

    for (const key of keys) {
      if (value === undefined || value === null) return undefined;
      value = value[key];
    }

    return value;
  }

  /**
   * Set current account (for testing different scenarios)
   */
  setCurrentAccount(account: AccountConfig | null): void {
    this.currentAccountSubject.next(account);
  }
}

/**
 * Mock ResourceUrlService
 * 
 * Provides fake URLs for testing components that load images/documents.
 * 
 * Usage:
 * ```typescript
 * providers: [
 *   { provide: ResourceUrlService, useClass: MockResourceUrlService }
 * ]
 * ```
 */
export class MockResourceUrlService {
  
  getUserAvatarUrl(imageName: string): Observable<string> {
    return of(`/mock/avatars/${imageName}`);
  }

  getTeamMemberPhotoUrl(imageName: string): Observable<string> {
    return of(`/mock/team/${imageName}`);
  }

  getUserDocumentUrl(userId: string, filename: string): Observable<string> {
    return of(`/mock/documents/${userId}/${filename}`);
  }

  getDeployedAssetUrl(assetPath: string): string {
    return `/mock/assets/${assetPath}`;
  }

  isProductionMode(): boolean {
    return false;
  }
}

/**
 * Mock ConfigRegistryService
 * 
 * Provides fake configuration registry for testing.
 */
export class MockConfigRegistryService {
  private configs = new Map<string, any>();

  register(key: string, config: any): void {
    this.configs.set(key, config);
  }

  get(key: string): any {
    return this.configs.get(key) || {};
  }

  has(key: string): boolean {
    return this.configs.has(key);
  }
}

/**
 * Mock TranslationService
 * 
 * Provides fake translations for testing.
 */
export class MockTranslationService {
  instant(key: string): string {
    return `[${key}]`; // Return key wrapped in brackets to identify untranslated keys
  }

  get(key: string): Observable<string> {
    return of(`[${key}]`);
  }

  setLanguage(lang: string): void {
    // No-op for mock
  }

  getDefaultLanguageCode(): string {
    return 'en';
  }

  onLangChange(): Observable<any> {
    return of({ lang: 'en' });
  }
}

// ============================================================================
// MOCK DI TOKENS
// ============================================================================

/**
 * Mock DEPLOYED_RESOURCES token value
 */
export const mockDeployedResources = {
  logos: {
    light: '/mock/logo-light.svg',
    dark: '/mock/logo-dark.svg'
  },
  images: {
    root: '/mock/images/',
    trustedBy: '/mock/images/trustedby/',
    flags: '/mock/images/flags/',
    backgrounds: '/mock/images/backgrounds/'
  },
  files: {
    root: '/mock/files/',
    markdown: '/mock/files/markdown/',
    pdf: '/mock/files/pdf/'
  }
};

/**
 * Mock UPLOADED_RESOURCES token value
 */
export const mockUploadedResources = {
  users: {
    root: '/mock/users/',
    profiles: '/mock/users/profiles/',
    avatars: '/mock/users/avatars/'
  },
  documents: {
    root: '/mock/documents/',
    attachments: '/mock/documents/attachments/',
    uploads: '/mock/documents/uploads/'
  },
  media: {
    root: '/mock/media/',
    photos: '/mock/media/photos/',
    videos: '/mock/media/videos/'
  }
};

/**
 * Mock PUBLIC_NAVIGATION token value
 */
export const mockPublicNavigation = {
  root: '/',
  home: '/home',
  auth: {
    root: '/auth',
    signup: '/auth/signup',
    signin: '/auth/signin',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email'
  },
  landing: {
    root: '/landing',
    home: '/landing',
    pricing: '/landing/pricing',
    features: '/landing/features',
    testimonials: '/landing/testimonials',
    faq: '/landing/faq',
    contact: '/landing/contact'
  },
  information: {
    root: '/information',
    about: '/information/about',
    terms: '/information/terms',
    privacy: '/information/privacy',
    cookies: '/information/cookies',
    accessibility: '/information/accessibility',
    contact: '/information/contact'
  },
  support: {
    root: '/support',
    faq: '/support/faq',
    contact: '/support/contact',
    status: '/support/status'
  },
  errors: {
    notFound: '/errors/404',
    serverError: '/errors/500',
    forbidden: '/errors/403'
  }
};

/**
 * Mock PRIVATE_NAVIGATION token value
 */
export const mockPrivateNavigation = {
  up: '..',
  auth: {
    signout: '/auth/signout',
    lockscreen: '/auth/lockscreen'
  },
  dashboards: {
    root: '/dashboards',
    main: '/dashboards/main',
    analytics: '/dashboards/analytics',
    overview: '/dashboards/overview'
  },
  settings: {
    root: '/settings',
    user: '/settings/user',
    account: '/settings/account',
    preferences: '/settings/preferences',
    security: '/settings/security',
    notifications: '/settings/notifications'
  },
  messages: {
    root: '/messages',
    inbox: '/messages/inbox',
    sent: '/messages/sent',
    compose: '/messages/compose',
    archived: '/messages/archived',
    drafts: '/messages/drafts'
  },
  teams: {
    root: '/teams',
    members: '/teams/members',
    invitations: '/teams/invitations',
    settings: '/teams/settings',
    projects: '/teams/projects'
  },
  purchases: {
    root: '/purchases',
    orders: '/purchases/orders',
    cart: '/purchases/cart',
    checkout: '/purchases/checkout',
    paymentMethods: '/purchases/payment-methods'
  },
  admin: {
    root: '/admin',
    users: '/admin/users',
    settings: '/admin/settings',
    logs: '/admin/logs',
    reports: '/admin/reports'
  },
  public: mockPublicNavigation
};

// ============================================================================
// SETUP HELPERS
// ============================================================================

/**
 * Standard test bed configuration
 * 
 * Provides common imports and mocks needed by most components.
 * 
 * Usage:
 * ```typescript
 * beforeEach(async () => {
 *   await setupTestBed([MyComponent]).compileComponents();
 * });
 * ```
 * 
 * @param declarations - Components/Directives/Pipes to declare
 * @param additionalConfig - Additional TestBed configuration to merge
 * @returns TestBed configuration
 */
export function setupTestBed(
  declarations: any[] = [],
  additionalConfig: Partial<TestModuleMetadata> = {}
): typeof TestBed {
  
  const baseConfig: TestModuleMetadata = {
    declarations: [...declarations],
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      TranslateModule.forRoot(),
      ...(additionalConfig.imports || [])
    ],
    providers: [
      // Mock common services
      { provide: 'AccountService', useClass: MockAccountService },
      { provide: 'ResourceUrlService', useClass: MockResourceUrlService },
      { provide: 'ConfigRegistryService', useClass: MockConfigRegistryService },
      { provide: 'TranslationService', useClass: MockTranslationService },
      
      // Mock DI tokens
      { provide: 'DEPLOYED_RESOURCES', useValue: mockDeployedResources },
      { provide: 'UPLOADED_RESOURCES', useValue: mockUploadedResources },
      { provide: 'PUBLIC_NAVIGATION', useValue: mockPublicNavigation },
      { provide: 'PRIVATE_NAVIGATION', useValue: mockPrivateNavigation },
      
      ...(additionalConfig.providers || [])
    ],
    schemas: additionalConfig.schemas || []
  };

  return TestBed.configureTestingModule(baseConfig);
}

/**
 * Create a spy object for a service
 * 
 * Useful for creating mocks with specific behavior.
 * 
 * Usage:
 * ```typescript
 * const mockService = createSpyObj('MyService', ['method1', 'method2']);
 * mockService.method1.and.returnValue(of('test'));
 * ```
 */
export function createSpyObj(baseName: string, methodNames: string[]): any {
  const obj: any = {};
  methodNames.forEach(name => {
    obj[name] = jasmine.createSpy(name);
  });
  return obj;
}

// ============================================================================
// COMMON TEST DATA
// ============================================================================

/**
 * Mock team member data (for testing team component)
 */
export const mockTeamMembers = [
  {
    id: '1',
    enabled: true,
    title: 'John Doe',
    role: 'Team Leader',
    imageName: 'avatar-1.jpg'
  },
  {
    id: '2',
    enabled: true,
    title: 'Jane Smith',
    role: 'Developer',
    imageName: 'avatar-2.jpg'
  }
];

/**
 * Mock account configurations (for testing account switching)
 */
export const mockAccounts = {
  default: {
    id: 'default',
    subdomain: 'default',
    name: 'Default Account',
    branding: {
      logo: {
        light: '/mock/default/logo-light.svg',
        dark: '/mock/default/logo-dark.svg'
      },
      colors: {
        primary: '#007bff',
        secondary: '#6c757d'
      },
      theme: 'light'
    },
    i18n: {
      defaultLanguage: 'en',
      supportedLanguages: ['en'],
      namespaces: ['common']
    },
    features: {
      authentication: true,
      multiLanguage: false
    }
  },
  foo: {
    id: 'foo',
    subdomain: 'foo',
    name: 'Foo Account',
    branding: {
      logo: {
        light: '/mock/foo/logo-light.svg',
        dark: '/mock/foo/logo-dark.svg'
      },
      colors: {
        primary: '#28a745',
        secondary: '#17a2b8'
      },
      theme: 'dark'
    },
    i18n: {
      defaultLanguage: 'en',
      supportedLanguages: ['en', 'es'],
      namespaces: ['common', 'foo']
    },
    features: {
      authentication: true,
      multiLanguage: true
    }
  }
};
