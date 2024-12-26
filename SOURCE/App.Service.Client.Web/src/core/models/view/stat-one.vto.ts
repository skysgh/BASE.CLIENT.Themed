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

  /** character to put before valye (eg: '$')*/
  public prefix: string | undefined;
  /** value to render*/
  public value: any;
  /** suffix to put after variable (eg:'%')*/
  public suffix: string | undefined;
  /** arrow to show near value showing if it has been going up or down*/
  public changeDirection: number = 0;
  /** decimal places of value, before suffix */
  public decimalPlaces: number = 0;

}
