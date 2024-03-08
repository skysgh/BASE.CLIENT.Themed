import { HasTitleAndDescriptionBase } from "../base/HasTitleAndDescriptionBase";
import { SystemParts } from "./SystemParts";
import { SystemOrganisation } from "./systemOrganisation";
import { SystemUrls } from "./systemUrls";


export class System extends HasTitleAndDescriptionBase {
  public purpose: string = '';

  public distributor: SystemOrganisation = new SystemOrganisation();
  public sponsor: SystemOrganisation = new SystemOrganisation();
  public developer: SystemOrganisation = new SystemOrganisation();

  public parts: SystemParts = new SystemParts();
  public urls: SystemUrls = new SystemUrls();
}
