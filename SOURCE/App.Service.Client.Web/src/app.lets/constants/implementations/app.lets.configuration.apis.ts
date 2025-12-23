import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { TAppletsConstantsApis } from "../t.app.lets.constants.apis";

const NAME = `Applets`;
const API_ROOT = StringService.replaceTemplate(environment.custom.urls.apis.section, NAME);


export const appletsConstantsApis: TAppletsConstantsApis = {
  root: `${API_ROOT}`,


  todo: {
    // Products Api
    products: `${API_ROOT}products`,

    // Orders Api
    orders: `${API_ROOT}orders`,

    // Customers Api
    customer: `${API_ROOT}customers`,

    sellers: `${API_ROOT}sellers`,

    projects: `${API_ROOT}projects`,

    tasks: `${API_ROOT}tasks`,

    files: `${API_ROOT}files`,
    kanbans: `${API_ROOT}kanbans`,
    folders: `${API_ROOT}folders`,

    customers: `${API_ROOT}customers`,
    contacts: `${API_ROOT}contacts`,
    companies: `${API_ROOT}companies`,
    //return this.http.get<any[]>(`/app/seller`);

    applications: `${API_ROOT}applications`,
    apiKeys: `${API_ROOT}apikeys`,
    tickets: `${API_ROOT}tickets`,
    deals: `${API_ROOT}deals`,

    invoices: `${API_ROOT}invoices`,
    todos: `${API_ROOT}todos`,
    calendars: `${API_ROOT}calendars`,
    leads: `${API_ROOT}leads`,

    transactions: `${API_ROOT}transactions`
  }
}
