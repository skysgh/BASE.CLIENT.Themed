
export interface SystemNavigation {
  // relative:
  up: string;
  root: string;
  home: string;

  // errors:
  errors: {
    root: string;
    error404: string;
    error500: string;
  },
  landing: {
    root: string;
  },
  public: {
    root: string;
    privacy: string;
    dataUse: string;
    terms: string;
    faq: string;
    aboutCompany: string;
    aboutProduct: string;
    contactUs: string;
    pricing: string;
    timeline: string;
    news: string;
    sitemap: string;
  },
  auth: {
    root: string;
    signup: string;
    signin: string;
    lockscreen: string;
    signout: string;
    register: string;
  },
  pages: {
    root: string;
    welcome: string;
  },
  support: {
    root: string;
  },
  settings: {
    root: string;
    system: string;
    tenancy: string;
    profile: string;
  },
  dashboard: {
    root: string;
  },
  products: {
    explore: string;
    create: string;
    root: string;
  },
  places: {
    root: string;
  },
  people: {
    root: string;
  },
  organisations: {
    root: string;
  },
  teams: {
    root: string;
  },
  messages: {
    root: string;
  },
  tasks: {
    root: string
  },
  scheduling: {
    root: string;
  },
  purchase: {
    root: string;
    checkout: string;
  },
  finance: {
    root: string;
  },
  news: {
    root: string;
  },
  reporting: {
    root: string;
  },
  misc: {
    todo: string;
  }
}

