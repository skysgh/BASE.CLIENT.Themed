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
      imagesLogos: "assets/images/logos/",
      imagesFlags: "assets/images/flags/",
      imagesClients: "assets/images/clients",
      imagesBrands:"assets/images/brands/",
      imagesCompanies: "assets/images/companies/",
      imagesSvg: "assets/images/svg",
      imagesSmall: "assets/images/small",
      imagesUsers: "assets/images/users,"
    }
  }

}

