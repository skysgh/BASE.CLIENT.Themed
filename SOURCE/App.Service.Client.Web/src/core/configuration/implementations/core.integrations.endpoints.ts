import { NAME } from '../../constants/t.core.constants';
import { TCoreIntegrationsEndpoints } from "../t.core.Integrations.endpoints";

export const coreIntegrationsEndpoints: TCoreIntegrationsEndpoints = {
  googleAnalytics: "https://www.google-analytics.com/analytics.js?key={{key}}",
  googleApis: 'https://maps.googleapis.com/maps/api',
  googleMaps: 'https://maps.googleapis.com/maps/api/js/?key={{key}}',
}
