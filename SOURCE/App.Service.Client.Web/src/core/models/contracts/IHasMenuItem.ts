import { IHasParentFK } from "./IHasParentFK";
import { IHasTitleAndDescription } from "./IHasTitleAndDescription";

/** Contract for a
 * single VTO MenuItem
 */
export interface IHasMenuItem extends IHasTitleAndDescription /*, IHasParentFK*/{
  id: number;
  parentId?: number,
  title: string,
  description: string,
  isTitle?: boolean;

  icon?: string,
  /** link, if it is not a title */
  link?: string,

  isLayout?: boolean;
  isCollapsed?: any,
  badge?: any,
  subItems?: IHasMenuItem[],
  childItem?:any
}
