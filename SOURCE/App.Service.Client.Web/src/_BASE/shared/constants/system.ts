import { System } from "../models/settings/system";

export const system: System = {

  title: "BASE",
  description: "Base API Support Environment",

  purpose: "Provide actionable oversight over large systems of organisations.",

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
  parts: {
    root: "assets/",
    i18n: "assets/l18n",
    images: {
      root: "assets/images/",
      logos: "assets/images/logos/",
      flags: "assets/images/flags/",
      clients: "assets/images/clients",
      brands:"assets/images/brands/",
      companies: "assets/images/companies/",
      svg: "assets/images/svg",
      small: "assets/images/small",
      users: "assets/images/users,"
    }
  },
  urls: {
    home: "/",
    privacy: "privacy/terms",
    dataUse: "privacy/datause",
    terms: "information/terms",
    landing: "landing",
    dashboard: "dashboard",
    error404: "/",
    error500: "/"
  }
}

