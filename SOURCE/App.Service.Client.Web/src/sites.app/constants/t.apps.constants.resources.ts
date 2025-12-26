import { TBaseConstantsResources } from "../../core/base/constants/t.base.constants.resources";

export type TAppsConstantsResources = TBaseConstantsResources & {
  open: {
    root: string;
    images: {
      logos: string;
      trustedBy: string;
      flags: string;
      backgrounds: string;
    };
  };
  sensitive: {
    root: string;
  }

};
