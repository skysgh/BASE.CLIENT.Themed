import { HasTitleAndDescription } from "../HasTitleAndDescription";

export class HasSummary extends HasTitleAndDescription{
  public iconId: string = '';
  public values: { key: string, value: any }[] = [];

}
