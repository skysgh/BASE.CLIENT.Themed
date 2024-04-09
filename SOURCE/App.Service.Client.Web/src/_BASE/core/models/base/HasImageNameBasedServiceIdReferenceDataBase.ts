import { IHasImageName } from "../contracts/IHasImageName";
import { HasTenantedReferenceDataBase } from "./HasTenantedReferenceDataBase";



/**
 * Implements:
 * 
 * IHasUUID,
 * IHasTenantId
 * IHasEnabled,
 * IHasReferenceData
 * IHasImageName
 */
export abstract class HasImageNameBasedServiceIdReferenceDataBase
    extends HasTenantedReferenceDataBase
  implements IHasImageName {

    imageName!: string;
}


