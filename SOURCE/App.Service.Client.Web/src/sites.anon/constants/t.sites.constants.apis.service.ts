import { TBaseConfiguration } from "../../core/base/configuration/t.base.configuration";
import { TBaseConstantsApis } from "../../core/base/constants/t.base.constants.apis";

export type TSitesConstantsApisService = TBaseConstantsApis & {

    /** API REST endpoint for retrieving and displaying a specific system's subset of available languages */
    languages: string;

    /** API REST endpoint for retrieving and displaying service permissions */
    permissions: string;

    /** API REST endpoint for retrieving and displaying service notifications */
    notifications: string;


};
