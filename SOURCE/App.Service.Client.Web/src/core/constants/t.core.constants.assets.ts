import { TBaseConstantsAssets } from "../base/constants/t.base.constants.assets";



export type TCoreConstantsAssets = TBaseConstantsAssets & {
  root: string;
  i18n: string;
  images: {
    root: string;
    recordTypes: string;
    flags: string;
  }
}

