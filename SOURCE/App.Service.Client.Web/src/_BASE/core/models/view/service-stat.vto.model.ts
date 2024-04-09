import { HasServiceIdEnabledTitleAndDescriptionBase } from "../base/HasServiceIdEnabledTitleAndDescriptionBase";
import { HasUntenantedEnabledTitleAndDescriptionBase } from "../base/HasUntenantedEnabledTitleAndDescriptionBase";
import { HasUntenantedReferenceDataBase } from "../base/HasUntenantedReferenceDataBase";
import { IHasGenericValue } from "../contracts/IHasGenericValue";

/**
 * View/Template Object
 * for describing a ServiceStat.
 * Implements
 * IHasUUID
 * IHasEnabled
 * IHasTitleAndDescription
 * IHasNumericValue
 * 
 * TODO: Enabled is not really required here,
 * just need a title, description, value
 * and maybe sometimes some hints as how to render
 * the stat ($, %, etc.)
 * 
 * See ServiceStat, from which it was mapped,
 * which will also have IServiceId.
 */
export class ServiceStatVTO
  extends HasUntenantedReferenceDataBase
  implements IHasGenericValue<number> {
    value!: number;
}

