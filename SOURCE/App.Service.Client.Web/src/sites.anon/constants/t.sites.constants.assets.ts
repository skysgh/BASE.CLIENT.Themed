import { NAME } from "./t.sites.constants";

import { TBaseConstantsAssets } from "../../core/base/constants/t.base.constants.assets";


export type TSitesConstantsAssets = TBaseConstantsAssets & {
  root: string;
  images: {
    root: string;
    faq: string;
    maintenance: string;
    pages: {
      root: string;
      home: {
        root: string,
        demos: string,
        features: string,
        intro: string,
        trustedBy: string,
      }
    }
  }
}


