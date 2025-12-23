import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TThemesT1ConfigurationNavigationInformationService } from "../t.themes.t1.configuration.navigation.information.service";

export const NAV_ROOT = `information/service/`;

export const themesT1ConfigurationNavigationInformationService: TThemesT1ConfigurationNavigationInformationService = {
  root: `${NAV_ROOT}`,

  index: `${NAV_ROOT}index`,

  aboutProduct: `${NAV_ROOT}about`,

  privacy: `${NAV_ROOT}privacy`,
  dataUse: `${NAV_ROOT}datause`,
  cookies: `${NAV_ROOT}cookie`,

  terms: `${NAV_ROOT}terms`,
  faqs: `${NAV_ROOT}faqs`,

  corrections: `${NAV_ROOT}corrections`,
  support: `${NAV_ROOT}support`,

  pricing: `${NAV_ROOT}pricing`,
  timeline: `${NAV_ROOT}timeline`,
  news: `${NAV_ROOT}news`,
  contact: `${NAV_ROOT}contact`,
  sitemap: `${NAV_ROOT}sitemap`,


};
