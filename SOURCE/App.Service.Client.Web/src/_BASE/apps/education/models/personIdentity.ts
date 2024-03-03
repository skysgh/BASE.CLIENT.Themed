import { IHasParentFK } from "../../../shared/models/contracts/IHasParentFK";
import { UUIDEntity } from "../../../shared/models/UUIDEntity";

// A person can have multiple Identities.
export class PersonIdentity extends UUIDEntity implements IHasParentFK {
  ParentFK?: string; 
}

