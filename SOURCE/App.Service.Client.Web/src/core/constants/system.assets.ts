/**
 * Supremely important to
 * a) not hard code strings anywhere in an app
 * b) separate static resources from dynamic resources
 *    so that static can be CDN'ed,
 *    and *public* dynamic resources can be cloud stored
 *    for direct access (*private* resources require
 *    storage in auth checking location...much different )
 */

export const systemAssets = {
  assets: {
    /** So important to clearly understand between
    /* publicy accessible resources and privately accessible
    /* resources, so keep on drilling it in from the start
    /* via names of configuration.
    */
    private: {
      /**
       * While building the front end, dynamic data is only
       * temporarily coming from asset folder.
       * TODO:Move to dynamic cloud storage.
       */
      dynamic: {
        /* private/dynamic is all about the userdata...*/
        default: {},
        /* private/dynamic is all about the userdata...*/
        services: {},
        /* private/dynamic is all about the userdata...*/
        sponsors: {},
        /* private/dynamic is all about the userdata...*/
        themes: {},
        /**
         * User data is data that is uploaded by end users
         * regarding records of themselves, media, etc.
         */
        userdata: {
          images: {
            /**
            * As a starting point, avatars of users should be private,
            * as it is PI, *but* they may post publicly, and
            * it will be accessed from Project Team page.
            * Still. It should be *consented*.
            * So moving it to Private:
             */
            users: "/assets/_BASE/private/dynamic/userdata/images/users/",

          },
          /**
           * TODO
           */
          resources: "NOT YET",
        },
      },
      /**
       * 
       */
      static: {
        /** Makes no sense to have default resources that are private/static. */
        default: {},
        /** Makes no sense to have sponsor resources that are private/static. */
        sponsors: {},
        /** Makes no sense to have prodcut resources that are private/static. */
        products: {},
        /** Makes no sense to have theme resources that are private/static. */
        themes: {},
        /** Makes no sense to have userdata that is private/static (or static for that matter). */
        userdata: {}
      },
    },
    /**
     * public resources won't cause Privacy drama if
     * accessed without permission.
     * But there is a risk that they are leveraged to
     * develop a DoS attack.
     * Hence to be moved to a CDN for whom it is part of their
     * service to thwart them.
     */
    public: {
      /**
      * TODO:
      * Dynamic/Public will be temporarily held in assets folder
      * while developing interface, but will be moved to cloud
      * storage when we perform the marriage
      * of front to back systems.
       */
      dynamic: {
        /**
         * Probably little that is dynamic/publicly/default accessible?
         */
        default: {},

        /**
         * The Service itself, will for sure have a logo,
         * and Service specific privacy and other statements, ands
         * Terms of Service.
         */
        services: {
          /** Public/dynamic because sys ops can load up media that
           * has to be public to be accessed. Terms, Statemments, etc.
           * TODO:
           * The issue remains how to provide language specific files.
           */
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

          },
        },

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
          images: {
            logos: "/assets/_BASE/public/dynamic/sponsor/images/logos/"
          }
        },

        /**
        * Note: don't think there is anything dynamic
        * about a theme.
        */
        themes: {
        },
        /**
         * Irrespective of the Organisation, Product or Theme
         * is data uploaded by end users.
         * This should be always be considered Private until
         * cleared for otherwise.
         */
        userdata: {

          images: {
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
          }
        }
      },


      /**
       * 
       */
      static: {
        default: {
          i18n: "/assets/_BASE/public/static/default/i18n/",
          images: {
            flags: "/assets/_BASE/public/static/default/images/flags/",
          }
        },
        sponsors: {
          images: {}
        },
        services: {
          images: {
            pages: {
              shared: {},
              home: {
                intro: "/assets/_BASE/public/static/services/images/pages/home/intro/",
                demos: "/assets/_BASE/public/static/services/images/pages/home/demos/",
                features: "/assets/_BASE/public/static/services/images/pages/home/features/",
                trustedby: "/assets/_BASE/public/static/services/images/pages/home/trustedby/",
              }
            }
          }
        },
        themes: {
          fonts: "/assets/_BASE/public/static/theme/fonts/",
          images: {
            layouts: "/assets/_BASE/public/static/themes/images/layouts",
            modals: "/assets/_BASE/public/static/themes/images/modals",
            pages: {
              backgrounds: "/assets/_BASE/public/static/themes/images/pages/backgrounds",
              comingsoon: "/assets/_BASE/public/static/themes/images/pages/comingsoon",
              errors: "/assets/_BASE/public/static/themes/images/pages/errors",
              maintainance: "/assets/_BASE/public/static/themes/images/pages/maintainance",
              about: "/assets/_BASE/public/static/themes/images/pages/about",
            },
            uncertain: {
              brands: "/assets/_BASE/public/static/themes/images/misc/brands/",
              galaxy: "/assets/_BASE/public/static/themes/images/uncertain/galaxy/",
              small: "/assets/_BASE/public/static/themes/images/uncertain/small/",
              svg: "/assets/_BASE/public/static/themes/images/uncertain/svg/",
              sweetalerts: "/assets/_BASE/public/static/themes/images/uncertain/sweetalerts/",
              clients: "/assets/_BASE/public/static/themes/images/uncertain/clients/",
            },
            unused: {

            }
          },
        },
        userdata: {
          // Not applicable in static zone.
        }
      },

      // irrespective of product or theme:
    }
  }
}
