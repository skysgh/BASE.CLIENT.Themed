import { IHasValue } from "../contracts/IHasValue";
import { IconBasedReferenceDataBase } from "../data/base/ImageBasedReferenceDataBase";



export class StatOneVTO extends IconBasedReferenceDataBase implements IHasValue {

  public prefix: string | undefined;
  public value: any;
  public suffix: string | undefined;
  public changeDirection : number = 0;
  public decimalPlaces: number = 0;


}
