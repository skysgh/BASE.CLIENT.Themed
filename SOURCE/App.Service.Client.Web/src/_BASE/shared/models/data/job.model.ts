import { IHasImageName } from "../contracts/IHasImageName";
import { IHasTypeFK } from "../contracts/IHasTypeFK";
import { ReferenceDataBase } from "./base/ReferenceDataBase";

export class Job extends ReferenceDataBase implements IHasImageName, IHasTypeFK {
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
