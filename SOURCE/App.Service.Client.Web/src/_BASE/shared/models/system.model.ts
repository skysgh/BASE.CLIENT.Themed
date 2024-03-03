import { HasTitleAndDescriptionBase } from "./base/HasTitleAndDescription";
import { SystemOrganisation } from "./systemOrganisation.model";

export class System extends HasTitleAndDescriptionBase {
  public sponsor: SystemOrganisation = new SystemOrganisation();
  public developer: SystemOrganisation = new SystemOrganisation();
}

