import { NAME } from "./t.sites.constants";

import { TBaseConstantsResources } from "../../core/base/constants/t.base.constants.resources";

export type TSitesConstantsResources = TBaseConstantsResources & {
  open: {
    root: string;
    images: {
      root: string;
      companies: string,
      products: string,
      recordTypes: string,
    }
    files: {
      root: string,
      markdown: string,
      pdf: string,
    },
  },
  sensitive: {
    root: string;
    images: {
      root: string;
      users: string;
    }
  }
}
