import { IHasImageName } from "../contracts/IHasImageName";
import { HasTenantedReferenceDataBase } from "./HasTenantedReferenceDataBase";


/**
 * Reinstated.
 * Although it's never a brilliant idea to embed
 * presentation layer logic in a database layer
 * and best to rely on an ImageId only, leaving
 * presentation logic to be handled by the
 * presentation layer, guided by the ImageId,
 * there are simply cases where you can't avoid.
 * This is the case of User managed records,
 * such as User Records/Avatars.
 * Possibly Company Records too (whatever doesn't
 * have an icon, stock image, or font glyph asset
 * that can be referenced.
 * In such cases, the field should contain an Image Name (filename+ext).
 */
export abstract class HasImageNameBasedTenantedReferenceDataBase
  extends HasTenantedReferenceDataBase
  implements IHasImageName {

  /**
   * Image Filename (with extension).
   */
  public imageName:string='';

}


