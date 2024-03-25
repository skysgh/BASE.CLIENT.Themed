import { IHasIconId } from "../../contracts/IHasIconId";
import { IHasImageName } from "../../contracts/IHasImageName";
import { ReferenceDataBase } from "./ReferenceDataBase";



export abstract class ImageBasedReferenceDataBase extends ReferenceDataBase implements IHasImageName {

  public imageName:string='';

}


export abstract class IconBasedReferenceDataBase extends ReferenceDataBase implements IHasIconId {
  public iconId: string = '';
}
