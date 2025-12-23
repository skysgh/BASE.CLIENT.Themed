
//export const systemApp = {
    /**
     * Assets specific to the App itself
     * and not the Theme,
     * and not the App.lets themselves.
     */
    sensitive: {
      static: {},
      dynamic: {
        
        files: {
          //root: "/assets/_BASE/public/dynamic/services/files/",
          markdown: "/assets/_BASE/public/dynamic/services/files/markdown/",
          pdf: "/assets/_BASE/public/dynamic/services/files/pdf/",
        },
        /** Json based Form Definitions.
         * public/dynamic because form defs may be
         * managed in future by sys ops
         * */
        formsDefs: "/assets/_BASE/public/dynamic/services/forms/",
        /** Logos for the service (BASE/whatever).
         * public/dynamic because service logo
         * may be managed in future by sys ops
         * */
        images: {
          /** backgrounds could be in a theme...but maybe it's specific to service? */
          backgrounds: {
            sidebars: "/assets/_BASE/public/dynamic/services/images/backgrounds/sidebars/",
            tops: "/assets/_BASE/public/dynamic/services/backgrounds/tops/"
          },
          logos: "/assets/_BASE/public/dynamic/services/images/logos/",
          /** uploaded images of companies that trust this service*/
          trustedBy: "/assets/_BASE/public/dynamic/services/images/trustedBy/",


          /**
           * Organisation will have some logos.
           * May have some publicly accessible media (a company statement?)
           * as well
           */
          sponsors: {
            /** Logos for the sponsor (MOT/whatever).
             * public/dynamic because service logo
             * may be managed in future by sys ops
             * */
            logos: "/assets/_BASE/public/dynamic/sponsor/images/logos/"
          },
          /**
            * Public/Dynamic because:
            * May be later configurable post deployement.
            * ANd Ok to share images of what types of records (People, Places, etc.)
            */
          recordTypes: "/assets/_BASE/public/dynamic/userdata/images/recordTypes/",

          /** Product/should be public (no PI). */
          products: "/assets/_BASE/private/dynamic/userdata/images/products/",

          /** Public/dynamic, as there is no PI */
          companies: "/assets/_BASE/private/dynamic/userdata/images/companies/",

          /**
            * Public/Dynamic because:
            * Organisations may upload/modify media (therefore dynamic)
            * that is publicly viewable (their school's home page?)
            * so it's public/dynamic.
            */
          organisations: "/assets/_BASE/public/dynamic/userdata/images/organisations/"
          },
        },
      },
    }
};
