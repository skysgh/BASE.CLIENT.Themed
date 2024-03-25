export const SystemQueryEndpoints = {

  // Api Calling
  API_URL: 'https://api-node.themesbrand.website/',

  // Auth Api
  AUTH_API: "https://api-node.themesbrand.website/auth/",

  base_capabilities:'base_capabilities',
  team:'base_team',
  base_languages: "base_languages",
  systemNotifications: "systemNotifications",
  agreements: "agreements",
  jobs: "jobs",
  notificaitons: "notifications",
  userQuotes: "userQuotes",

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
