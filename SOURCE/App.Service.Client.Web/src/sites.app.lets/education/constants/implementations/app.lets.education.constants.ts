import { environment } from "../../../../environments/environment";
import { TAppletsEducationConstants } from "../t.app.lets.education.constants";
import { NAME } from "../app.lets.education.constants.name";
import { appletsEducationConstantsApis } from "./app.lets.education.configuration.apis";
import { appletsEducationConstantsAssets } from "./app.lets.education.constants.assets";
import { appletsEducationConstantsResources } from "./app.lets.education.constants.resources";

export const appletsEducationConstants : TAppletsEducationConstants = {
  id: NAME,

  apis: appletsEducationConstantsApis,

  assets: appletsEducationConstantsAssets,

  environment: environment,

  resources: appletsEducationConstantsResources
};

