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
  pages: {
    root: string;
    private: {
      welcome: string;
    },

    public: {
      information: {
        root: string;
        index: string;
        privacy: string;
        dataUse: string;
        terms: string;
        faq: string;
        aboutCompany: string;
        aboutProduct: string;
        contact: string;

        pricing: string;
        timeline: string;
        news: string;
        sitemap: string;
        corrections: string;
        support: string;
      }
      landing: {
        root: string;
        index: string;
        comingSoon: string;
        pricing: string;
        maintenance: string;
        opportunities: string;
        faq: string;
      },
    }
  },
  auth: {
    root: string;
    signup: string;
    signin: string;
    lockscreen: string;
    signout: string;
    register: string;
  },
  support: {
    root: string;
  },
  settings: {
    root: string;
    system: string;
    tenancy: string;
    group: string;
    user: string;
  },
  dashboard: {
    root: string;
    main: string;
  },
  apps: {
    architecture: {
      root: string;
      values: string;
      qualities: string;
      principles: string;
      patterns: string;
    },
    spikes: {
      root: string;
      spike: {
        explore: string;
        create: string;
        root: string;
      },
      subSpike: {
        explore: string;
        create: string;
        root: string;
      },
    }
    education: {
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
        all: string;
        learners: string;
        caretakers: string;
        teachers: string;
        administrators: string;
        principals: string;
        specialists: string;
        alumni: string;
      },
      enrollments: {
        root: string;
      },
      finances: {
        root: string;
      },
      participation: {
        root: string;
      },
      presence: {
        root: string;
      },
      assessments: {
        root: string;
      }
      progress: {
        root: string;
      },
      accomplishments: {
        root: string;
      }
    }
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
  },
}

