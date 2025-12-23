import { TBaseConfiguration } from "../../../../core/base/configuration/t.base.configuration";

/**
 * Locally typed 
 */
export type ThemesT1ConfigurationType = TBaseConfiguration & {
  name: string,
  description: string,
  assets: {
    open: {
      static: {
        //scss: string,
        fonts: string,
        i18n: string,
        images: {
          layouts: string,
          /* backgrounds for views that are consistent with the theme */
          backgrounds: string,
          /**
           * Images to back modals (signin, etc.)
           */
          modals: string,

          // Default pages of the theme:
          pages: {
            comingsoon: string,
            maintainance: string,
            errors: string,
          },

          uncertain: {
            brands: string,
            galaxy: string,
            small: string,
            svg: string,
            sweetalerts: string,
            clients: string,
          },
        }
      },
      //  dynamic: {
      //  }
    },
    //sensitive: {
    //  static: {

    //  },
    //  dynamic: {

    //  }
    //}


  }
}






