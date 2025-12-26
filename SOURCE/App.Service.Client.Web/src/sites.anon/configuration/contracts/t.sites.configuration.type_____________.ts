import { CoreAgConfigurationType } from "../../../core.ag/configuration/contracts/t.coreAg.configuration.type";
import { TBaseConfiguration } from "../../../core/base/configuration/t.base.configuration";

/**
 * Locally typed 
 */
export type SitesConfigurationType = TBaseConfiguration & {
  assets: {
    open: {
      static: {
        images: {
          pages: {
            faqs: string,
            maintenance: string
          },
        }
      }
    }
  }
  // No assets for now.
  themes: TThemesConfiguration,
  //coreAg: CoreAgConfigurationType,
  //core: CoreConfigurationType,
}
