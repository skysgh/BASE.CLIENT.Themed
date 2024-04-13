// Constants:
import { environment as importedEnvironmentConst } from '../../../environments/environment';



export const systemQueryEndpoints = {

  recordsPerPage:20,

  baseUrl: importedEnvironmentConst.custom.service.baseUrl + 'api/',

  baseRestUrl: importedEnvironmentConst.custom.service.baseUrl
    + 'api/'
    + (importedEnvironmentConst.custom.service.type == 'json-server' ? 'rest/' : 'tables/'),

  // Api Calling
  API_URL: 'https://api-node.themesbrand.website/',

  // Auth Api
  AUTH_API: "https://api-node.themesbrand.website/auth/",

  base: {
    system: {
      /** API REST endpoint for the list of services served from this system */
      services: "base_system_Services",
      /** API REST endpoint for retrieving and displaying server diagnostic records */
      diagnosticTraces: "base_system_DiagnosticTraces",
      /** API REST endpoint for retrieving and displaying server error records */
      errorRecords: "base_system_ErrorRecords",
      /** API REST endpoint for retrieving and displaying server sessions */
      sessions: "base_system_Sessions",
      /** API REST endpoint for retrieving and displaying embargoes applied */
      base_System_Embargoes: "base_system_Embargoes",
      /** API REST endpoint for retrieving and displaying embargoed countries*/
      base_System_ExcludedCountries: "base_system_ExcludedExcluded",
      /** API REST endpoint for retrieving and displaying ip ranges of countries*/
      base_System_ExcludedIPRanges: "base_system_ExcludedIpRanges",
      /** API REST endpoint for retrieving and displaying server session operations */
      sessionOperations: "base_system_SessionOperations",
      /** API REST endpoint for retrieving and displaying system users */
      users: "base_system_Users",
      /** API REST endpoint for retrieving and displaying all system languages */
      languages: "base_system_Languages",
      /** API REST endpoint for retrieving and displaying media encoding types (text, markdown, html, pdf) */
      textMediaEncodingTypes: "base_service_TextMediaEncodingTypes",
      /** API REST endpoint for retrieving and displaying statement types (tracking, privacy,data use) */
      statementTypes:"base_system_StatementTypes"
    },
    service: {
      /** API REST endpoint for retrieving and displaying a specific system's features (which generally will be more than
       * those used to describe a pricing plan (see base_service_PricingPlan_Features)
       */
      feature: "base_service_Features",
      /** API REST endpoint for retrieving and displaying a specific system's subset of available languages */
      languages: "base_service_Languages",
      /** API REST endpoint for service capabilities (for rendering on its landing page, etc.) */
      capabilities: 'base_service_Capabilities',
      /** API REST endpoint for service stats (for rendering on its landing page, etc.) */
      stats: 'base_service_Stats',
      /** API REST endpoint for service capabilities (for rendering on its landing page, etc.) */
      trustedBy: "base_service_TrustedBy",
      /** API REST endpoint for service user quotes (for rendering on its landing page, etc.) */
      endorsements: "base_service_UserEndorsements",
      /** API REST endpoint for service user faqs (for rendering on its landing page, etc.) */
      faqs: "base_service_Faqs",
      /** API REST endpoint for service user faqs (for rendering on its landing page, etc.) */
      faqsCategories: "base_service_FaqCategories",
      /** API REST endpoint for service pricing options (for rendering on its landing page, etc.) */
      pricingPlans: "base_service_PricingPlans",
      /** API REST endpoint for service pricing option features (for rendering on its landing page, etc.) */
      pricingPlanFeatures:"base_service_PricingPlanFeatures",
      /** API REST endpoint for service pricing option features (for rendering on its landing page, etc.) */
      pricingPlanFeaturesAllocation: "base_service_PricingPlanFeaturesAllocation",
      /** API REST endpoint for service team delivery members (for rendering on its landing page, etc.) */
      deliveryTeamMembers: "base_service_DeliveryTeamMembers",
      /** API REST endpoint for service team opportunities (for rendering on its landing page, etc.) */
      jobs: "base_service_DeliveryRoleOpportunities",
      /** API REST endpoint for retrieving and displaying service permissions */
      permissions: "base_service_Permissions",
      /** API REST endpoint for retrieving and displaying service notifications */
      notifications: "base_service_Notifications",

      product: "base_service_Products",
      productTypes: "base_service_ProductTypes",
      productCarts: "base_service_ProductCarts",

      person: "person",
      personIdentityNames: "personIdentityNames",
      app_personIdentities:"app_personIdentities",
      app_persons: "app_persons",

      todo: {
        statements: "base_service_Statements",
        agreements: "base_service_Agreements",
        templateItems: "templateItems",
        templateSubItems: "templateSubItems",
        "licenses": "licenses",
        "subscriptions": "subscriptions",
        "notificationDisplayItem": "todo_notificationDisplayItem",
        todo_tasks:"todo_tasks",
      },
      apps: {
        spike: {
          spike: "apps_spike_Spikes",
          spikes: "apps_spike_Subspikes",
        },
        architecture: {
          values:"app_architecture_Values",
          qualityCategories: "app_architecture_QualityCategories",
          qualityTypes: "app_architecture_QualityTypes",
          qualities: "app_architecture_Qualities",
          principleType: "app_architecture_PrincipleTypes",
          principles: "app_architecture_Principles",
        }
      }
    }
  },




      // Products Api
  products: 'apps/products/',

  // Orders Api
  orders: 'apps/orders',

  // Customers Api
  customer: 'apps/customers',

  sellers: 'app/sellers',
  projects: '/app/projects',

  tasks: `app/tasks`,

  files:  `apps/files`,
  kanbans: `apps/kanbans`,
  folders: `apps/folders`,

  customers: `apps/customers`,
  contacts: `apps/contacts`,
  companies: `apps/companies`,
  //return this.http.get<any[]>('/app/seller');

  applications: `apps/applications`,
  apiKeys: '/app/apikeys',
  tickets: '/app/tickets',
  deals: '/app/deals',

  invoices: '/app/invoices',
  todos: `apps/todos`,
  calendars: `apps/calendars`,
  leads: `apps/leads`,

  transactions: `apps/transactions`

};
