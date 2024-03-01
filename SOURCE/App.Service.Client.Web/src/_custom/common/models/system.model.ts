import { HasTitleAndDescription } from "./HasTitleAndDescription";
import { SystemOrganisation } from "./systemOrganisation.model";

export class System extends HasTitleAndDescription {
  public sponsor: SystemOrganisation = new SystemOrganisation();
  public developer: SystemOrganisation = new SystemOrganisation();
}
