export interface IHasMenuItem {
  id: number;
  parentId?: number,
  isTitle?: boolean;
  isLayout?: boolean;
  isCollapsed?: any,
  title: string,
  description: string,
  icon?: string,
  link?: string,
  badge?: any,
  subItems?: IHasMenuItem[],
  childItem?:any
}
