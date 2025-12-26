import { TBaseConfiguration } from "../../core/base/configuration/t.base.configuration";
import { TBaseConstantsApis } from "../../core/base/constants/t.base.constants.apis";


export type TSitesConstantsApisPricing = TBaseConstantsApis & {
  /** API REST endpoint for service pricing options (for rendering on its landing page, etc.) */
  pricingPlans: string;
  /** API REST endpoint for service pricing option features (for rendering on its landing page, etc.) */
  pricingPlanFeatures: string;
  /** API REST endpoint for service pricing option features (for rendering on its landing page, etc.) */
  pricingPlanFeaturesAllocation: string;


};
