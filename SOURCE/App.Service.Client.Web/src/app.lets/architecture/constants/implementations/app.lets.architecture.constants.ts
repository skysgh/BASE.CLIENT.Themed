import { environment } from "../../../../environments/environment";
import { StringService } from "../../../../core/services/string.service"; 
import { NAME } from "../app.lets.architecture.constants.name";
import { appletsArchitectureConstantsApis } from "./app.lets.architecture..constants.apis";
import { appletsArchitectureConstantsAssets } from "./app.lets.architecture.constants.assets";
import { TAppletsArchitectureConstants } from "../t.app.lets.architecture.constants";
import { appletsArchitectureConstantsResources } from "./app.lets.architecture.constants.resources";

export const appletsArchitectureConstants : TAppletsArchitectureConstants =  {

  id: NAME,

  apis: appletsArchitectureConstantsApis,

  assets: appletsArchitectureConstantsAssets,

  environment: environment,

  resources: appletsArchitectureConstantsResources

}

