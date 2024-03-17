import { environment } from "../../../environments/environment";
import { System } from "./contracts/system";

export const system: System = {

  title: "BASE",
  description: "Base API Support Environment",

  purpose: "Provide actionable oversight over large systems of organisations.",

  environment: environment,

  distributor: {
    title: "Ministry Of Technology",
    description: "...",
    email: "contact@ministryof.tech",
    tel: "+64 21 159 6440"
  },
  sponsor: {
    title: "Ministry Of Technology",
    description: "...",
    email: "contact@ministryof.tech",
    tel: "+64 21 159 6440"
  },
  developer: {
    title: "Machine Brains, Inc.",
    description: "Artificial assisted purveyors of digital realities.",
    email: "contact@machinebrains.com",
    tel: "+64 21 159 6440"
  },
  sources: {
    root: "/",
    assets: {
      root: "assets/",
      i18n: "assets/l18n/",
      images: {
        root: "assets/images/",
        logos: "assets/images/logos/",
        flags: "assets/images/flags/",
        clients: "assets/images/clients/",
        brands: "assets/images/brands/",
        companies: "assets/images/companies/",
        svg: "assets/images/svg/",
        small: "assets/images/small/",
        temp: {
          users: "assets/images/users/"
        }
      }
    }
  },

  configuration: {
    defaultLanguageCode: 'en',
    defaultAppName:'spike'
  },
  navigation: {
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
    landing: {
      root: "/landing/",
    },
    public: {
      root: "/information/",
      privacy: "/information/privacy",
      dataUse: "/information/datause",
      terms: "/information/terms",
      faq: "/information/faq",
      aboutCompany: "/information/aboutus",
      aboutProduct: "/information/about",
      contactUs: "information/contactus",
      pricing: "information/pricing",
      timeline: "information/timeline",
      news: "information/news",
      sitemap: "information/sitemap"
    },
    auth: {
      root: "/auth/",
      signup: "/auth/signup/basic",
      signin: "/auth/signin/basic",
      lockscreen: "/auth/lockscreen/basic",
      signout: "/auth/signout/",
      register: "/users/register"
    },
    pages: {
      root: "/pages/",
      welcome: "/pages/welcome",
    },
    support: {
      root: '/pages/support'
    },
    settings: {
      root: "/settings/",
      system: '/settings/system',
      tenancy: '/settings/system',
      profile: '/settings/profile',
    },
    dashboard: {
      root: "apps/dashboard/"
    },
    products: {
      root: "/apps/products/",
      explore: "/apps/products/",
      create: "/apps/products/",
    },
    places: {
      root: "/apps/places/",
    },
    people: {
      root: "/apps/people/",
    },
    organisations: {
      root: "/apps/organisations/",
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
}

