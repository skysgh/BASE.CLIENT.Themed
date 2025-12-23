import { TBaseConfiguration } from "../../core/base/configuration/t.base.configuration";
import { TBaseConstantsApis } from "../../core/base/constants/t.base.constants.apis";


export type TSitesConstantsApisBrochure = TBaseConstantsApis & {


    /** API REST endpoint for retrieving and displaying a specific system's features (which generally will be more than
     * those used to describe a pricing plan (see base_service_PricingPlan_Features)
     */
    feature: string;
    /** API REST endpoint for retrieving and displaying a specific system's subset of available languages */
    languages: string;
    /** API REST endpoint for service capabilities (for rendering on its landing page, etc.) */
    capabilities: string;
    /** API REST endpoint for service stats (for rendering on its landing page, etc.) */
    stats: string;
    /** API REST endpoint for service capabilities (for rendering on its landing page, etc.) */
    trustedBy: string;
    /** API REST endpoint for service user quotes (for rendering on its landing page, etc.) */
    endorsements: string;
    /** API REST endpoint for service user faqs (for rendering on its landing page, etc.) */
    faqs: string;
    /** API REST endpoint for service user faqs (for rendering on its landing page, etc.) */
    faqsCategories: string;

    /** API REST endpoint for service team delivery members (for rendering on its landing page, etc.) */
    deliveryTeamMembers: string;
    /** API REST endpoint for service team opportunities (for rendering on its landing page, etc.) */
    jobs: string;
};
