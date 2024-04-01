import { HasTenantedEnabledTitleAndDescriptionBase } from "../base/HasTenantedEnabledTitleAndDescriptionBase";
import { IHasImageName } from "../contracts/IHasImageName";
import { IHasTypeFK } from "../contracts/IHasTypeFK";

export class Job extends HasTenantedEnabledTitleAndDescriptionBase
  implements
  IHasImageName,
  IHasTypeFK {
  // Has Id, enabled, title, description
  public company: string = '';
  public imageName: string='';
  public locationFK: any;
  public typeFK: any;
  public salaryRangeLower: number=0;
  public salaryRangeUpper: number=0;
  public bookmark: boolean=false;
  public skill: string[] = [];
  //  bookmark: true
  }
