export const systemNavigation = {
  // relative:
  up: "../",
  root: "/",
  home: "/",

  // errors:
  errors: {
    root: "/errors/",
    error404: "/errors/404",
    error500: "/errors/500",
  },
  pages: {
    root: "/pages/",
    private: {
      welcome: "/pages/information/welcome",
    },

    public: {
      information: {
        root: "pages/information/",
        index: "pages/information/index",
        cookie: "pages/information/cookie",
        privacy: "/pages/information/privacy",
        dataUse: "/pages/information/datause",
        terms: "/pages/information/terms",
        faq: "/pages/information/faq",
        aboutCompany: "/pages/information/aboutus",
        aboutProduct: "/pages/information/about",
        contact: "/pages/information/contact",
        pricing: "/pages/information/pricing",
        timeline: "/pages/information/timeline",
        news: "/pages/information/news",
        sitemap: "/pages/information/sitemap",
        corrections: "/pages/information/corrections",
        support: "/pages/information/support",
      },

      landing: {
        root: "/landing/",
        index: "/landing/index",
        comingSoon: "/landing/coming-soon",
        opportunities: "/landing/opportunities",
        pricing: "/landing/pricing",
        maintenance: "/landing/maintenance",
        faq: "/landing/faq"
      },
    },
  },
  auth: {
    root: "/auth/",
    signup: "/auth/signup/basic",
    signin: "/auth/signin/basic",
    lockscreen: "/auth/lockscreen/basic",
    signout: "/auth/signout/",
    register: "/users/register",
    login: '/auth/login',
  },
  support: {
    root: '/pages/support'
  },
  settings: {
    root: "/settings/",
    system: '/settings/system',
    tenancy: '/settings/system',
    group: '/settings/groups',
    user: '/settings/profile',
  },
  dashboard: {
    root: "/dashboards",
    main: "/dashboards/main"
  },
  apps: {
    architecture: {
      root: "apps/architecture/values",
      values: "apps/architecture/values",
      qualities: "apps/architecture/qualities",
      principles: "apps/architecture/principles",
      patterns: "apps/architecture/patterns"
    },
    spikes: {
      root: "/apps/spikes/",
      spike: {
        explore: '/apps/spikes/spike',
        create: '/apps/spikes/spike',
        root: '/apps/spikes/spike'
      },
      subSpike: {
        explore: '/apps/subSpikes/spike',
        create: '/apps/subSpikes/spike',
        root: '/apps/subSpikes/spike'
      }
    },
    education: {
      products: {
        root: "/apps/education/products/",
        explore: "/apps/education/products/",
        create: "/apps/education/products/",
      },
      places: {
        root: "/apps/education/places/",
      },
      people: {
        root: "/apps/education/people/",
        all: "/apps/education/people/all",
        learners: "/apps/education/people/learners",
        teachers: "/apps/education/people/teachers/",
        caretakers: "/apps/education/people/caretakers/",
        administrators: "/apps/education/people/administrators/",
        principals: "/apps/education/people/principals/",
        specialists: "/apps/education/people/specialists/",
        alumni: "/apps/education/people/alumni/"
      },
      enrollments: {
        root: "/apps/education/enrollment"
      },
      finances: {
        root: "/apps/education/finances"
      },
      presence: {
        root: "/apps/education/presence"
      },
      participation: {
        root: "/apps/education/participation"
      },
      assessments: {
        root: "/apps/education/assessments"
      },
      progress: {
        root: "/apps/education/progress"
      },
      accomplishments: {
        root: "/apps/education/accomplishments"
      }
    },
  },
  organisations: {
    root: "/apps/education/organisations/",
  },
  teams: {
    root: "/apps/teams/",
  },
  messages: {
    root: "/apps/comms/",
  },
  tasks: {
    root: "/apps/comms/",
  },
  scheduling: {
    root: "/apps/scheduling/",
  },
  purchase: {
    root: "/apps/purchase/",
    checkout: "/apps/purchase/checkout",
  },
  finance: {
    root: "/apps/finance/",
  },
  news: {
    root: "/apps/news/"
  },
  reporting: {
    root: "/apps/reporting/"
  },
  misc: {
    todo: "/"
  }
}
