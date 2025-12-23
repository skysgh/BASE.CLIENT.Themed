import { NAME } from "../t.sites.constants";

import { TBaseConstantsApis } from "../../../core/base/constants/t.base.constants.apis";
import { StringService } from "../../../core/services/string.service";
import { environment } from "../../../environments/environment";
import { TSitesConstantsApisProducts } from "../t.sites.constants.apis.products";
import { TSitesConstantsApisPricing } from "../t.sites.constants.apis.pricing";

const API_ROOT =
  StringService.replaceTemplate(
    environment.custom.urls.apis.section,
    NAME).toLowerCase();

export const sitesConstantsApisPricing: TSitesConstantsApisPricing = {
  /** API REST endpoint for service pricing options (for rendering on its landing page, etc.) */
  pricingPlans: `${API_ROOT}base_service_PricingPlans`,
  /** API REST endpoint for service pricing option features (for rendering on its landing page, etc.) */
  pricingPlanFeatures: `${API_ROOT}base_service_PricingPlanFeatures`,
  /** API REST endpoint for service pricing option features (for rendering on its landing page, etc.) */
  pricingPlanFeaturesAllocation: `${API_ROOT}base_service_PricingPlanFeaturesAllocation`,


}
