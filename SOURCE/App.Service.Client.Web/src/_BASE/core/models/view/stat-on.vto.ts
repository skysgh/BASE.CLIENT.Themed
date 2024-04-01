import { HasImageIdBasedTenantedReferenceDataBase } from "../base/HasImageIdBasedTenantedReferenceDataBase";
import { IHasValue } from "../contracts/IHasValue";



/**
 * Implements
 * IHasImageId,
 * IHasUUID, IHasTenancyId,
 * IHasReferenceData
 * IHasEnabled,
 * IHasTitleAndDescription
 */
export class StatOneVTO
  extends HasImageIdBasedTenantedReferenceDataBase
  implements IHasValue {

  public prefix: string | undefined;
  public value: any;
  public suffix: string | undefined;
  public changeDirection : number = 0;
  public decimalPlaces: number = 0;


}
