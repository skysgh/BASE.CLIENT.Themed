

///** Use for Configuraiton */
//export const generateBaseUrls(resourceUrlRoot: string, apiUrlRoot: string):any => (
//  {

//    //baseRestUrl: environment.custom.service.baseUrl
//    //  + 'api/'
//    //  + (environment.custom.service.type == 'json-server' ? 'rest/' : 'tables/'),

    

//    resources: {
//      open: {
//        /**
//         * Static files are in the source code,
//         * just not packaged, so are on the webserver.
//         */
//        static:
//        {
//          root: `${resourceUrlRoot}`,
//          /** `/core/`*/
//          core: `${resourceUrlRoot}/core/`,
//          /** `/core.ag/`*/
//          coreAg: `${resourceUrlRoot}/core.ag/`,
//          /** `/themes/`*/
//          themes: `${resourceUrlRoot}/themes/`,
//          /** `/sites/`*/
//          sites: `${resourceUrlRoot}/sites/`,
//          /** `/apps/`*/
//          apps: `${resourceUrlRoot}/apps/`,
//          /** `/app.lets/`*/
//          applets: `${resourceUrlRoot}/app.lets/`,
//          /** `/app.lets/`*/
//          appletModules: `${resourceUrlRoot}/app.lets/{0}/`

//        },
//        /**
//        * Dynamic files are dynamically added and removed
//        * from storage on a blob storage.
//        * Only for demo purposes is some media is stored in the source code
//        * (so it can be viewed without access to a blob storage)
//        *
//        * Examples are images - that are not of peopel (ie PII) --
//        * uploaded by users.
//        *
//        * So they use the public dynamicStorageUrl (ie, a blob storage)
//        */
//      dynamic: {
        
//      }
//    },

//    /** Use for Navigation
//     * 
//     */
  
//  navigation: {
//    root: `/`,
//    /** `/apps/` */
//    core: `/apps/`,
//    /** `/apps/` */
//    coreAg: `/apps/`,
//    /** `/themes/` */
//    themes: `/apps/`,
//    /** `/sites/` */
//    sites: `/apps/`,
//    /** `/apps/`*/
//    apps: `/apps/`,
//    /** `/apps/modules/`*/
//    applets: `/apps/`,
//    /** `/apps/modules/`*/
//    appletModules: `/apps/modules/{0}/`
//  },

//  /**
//   * Use for Navigation
//   * 
//   */
//  apis: {
//    root: `${apiUrlRoot}/api/`,
//    /** `/api/`*/
//    core: `${apiUrlRoot}/api/`,
//    /** `/api/`*/
//    coreAg: `${apiUrlRoot}/api/`,
//    /** `/api/`*/
//    themes: `${apiUrlRoot}/api/`,
//    /** `/api/`*/
//    sites: `${apiUrlRoot}/api/`,
//    /** `/api/`*/
//    apps: `/api/`,
//    /** `/api/`*/
//    applets: `${apiUrlRoot}/api/`,
//    /** `/api/`*/
//    appletModules: `${apiUrlRoot}/api/`
//  }
//}
//);
