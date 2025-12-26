/**
 * Token Interface Definitions
 * 
 * Parent tier defines CONTRACTS (interfaces) for DI tokens.
 * Child tiers create actual InjectionTokens implementing these interfaces.
 * 
 * This maintains loose coupling:
 * - Parent: Defines "what" (interfaces)
 * - Children: Provide "how" (values)
 */

// ============================================================================
// RESOURCE INTERFACES
// ============================================================================

export interface IDeployedResources {
  logos: {
    light: string;
    dark: string;
  };
  images: {
    root: string;
    trustedBy: string;
    flags: string;
    backgrounds: string;
  };
  files: {
    root: string;
    markdown: string;
    pdf: string;
  };
}

export interface IUploadedResources {
  users: {
    root: string;
    profiles: string;
    avatars: string;
  };
  documents: {
    root: string;
    attachments: string;
    uploads: string;
  };
  media: {
    root: string;
    photos: string;
    videos: string;
  };
}

// ============================================================================
// API INTERFACES
// ============================================================================

export interface IApiEndpoints {
  brochure: string;
  persons: string;
  pricing: string;
  products: string;
  service: string;
}

// ============================================================================
// NAVIGATION INTERFACES
// ============================================================================

export interface IPublicNavigation {
  root: string;
  home: string;
  auth: {
    root: string;
    signup: string;
    signin: string;
    forgotPassword: string;
    resetPassword: string;
    verifyEmail: string;
  };
  landing: {
    root: string;
    home: string;
    pricing: string;
    features: string;
    testimonials: string;
    faq: string;
    contact: string;
  };
  information: {
    root: string;
    about: string;
    terms: string;
    privacy: string;
    cookies: string;
    accessibility: string;
    contact: string;
  };
  support: {
    root: string;
    faq: string;
    contact: string;
    status: string;
  };
  errors: {
    notFound: string;
    serverError: string;
    forbidden: string;
  };
}

export interface IPrivateNavigation {
  up: string;
  public: IPublicNavigation;
  auth: {
    signout: string;
    lockscreen: string;
  };
  dashboards: {
    root: string;
    main: string;
  };
  settings: {
    root: string;
    user: string;
    account: string;
  };
  messages: {
    root: string;
    inbox: string;
  };
  teams: {
    root: string;
  };
  purchases: {
    root: string;
  };
}
