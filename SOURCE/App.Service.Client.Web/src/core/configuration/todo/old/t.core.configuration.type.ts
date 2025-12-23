//import { AppletsConfigurationType } from "../../../app.lets/configuration/contracts/t.app.lets.configuration.type"
//import { CoreAgConfigurationType } from "../../../core.ag/configuration/contracts/t.coreAg.configuration.type"
//import { SitesConfigurationType } from "../../../sites/configuration/contracts/t.sites.configuration.type"
//import { ThemesConfigurationType } from "../../../themes/configuration/contracts/t.themes.configuration.type"
//import { BaseConfigurationType } from "./t.base.configuration.type"

//export type CoreConfigurationType = BaseConfigurationType & {
//  /**
//   * Default language code (eg: 'en', 'fr', etc.)
//   */
//  defaultLanguageCode: string,

//  assets: {
//    open: {
//      static: {
//        /**
//         * Path to Internationalisation data.
//         */
//        i18n: string,
//        images: {
//          /**
//           * Path to resizeable svg images of country flags
//           * representing cultures.
//           */
//          flags: string
//        }
//      }
//    },
//  //  sensitive: {
//  //    //n/a for now.
//  //  }
//  }
//  /**
//   * Access to core Ag configuration values
//   */
//  coreAg: CoreAgConfigurationType,
//  /**
//   * Access to theme configuration values
//   */
//  themes: ThemesConfigurationType,
//  /**
//   * Access to site configuration values
//   */
//  sites: SitesConfigurationType

//  //apps: AppConfigurationType

//  applets: AppletsConfigurationType

//}
