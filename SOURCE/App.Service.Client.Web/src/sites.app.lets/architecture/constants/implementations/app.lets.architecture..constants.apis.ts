import { StringService } from "../../../../core/services/string.service";
import { environment } from "../../../../environments/environment";
import { TAppletsArchitectureConstantsApis } from "../t.app.lets.architecture.constants.apis";
import { PATHFRAGMENT } from "../app.lets.architecture.constants.name";

const API_SEGMENT = PATHFRAGMENT.replace(/\//g, '.');
const API_ROOT = StringService.replaceTemplate(environment.custom.urls.apis.section, API_SEGMENT);


export const appletsArchitectureConstantsApis: TAppletsArchitectureConstantsApis = {
  root: `${API_ROOT}`,

  values: `${API_ROOT}base_system_architecture_Values`,
  qualityCategories: `${API_ROOT}base_system_architecture_QualityCategories`,
  qualityTypes: `${API_ROOT}base_system_architecture_QualityTypes`,
  qualities: `${API_ROOT}base_system_architecture_Qualities`,
  principleType: `${API_ROOT}base_system_architecture_PrincipleTypes`,
  principles: `${API_ROOT}base_system_architecture_Principles`,

}
