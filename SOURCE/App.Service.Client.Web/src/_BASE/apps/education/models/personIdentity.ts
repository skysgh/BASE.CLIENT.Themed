import { IHasParentFK } from "../../../shared/models/contracts/IHasParentFK";
import { UUIDEntityBase } from "../../../shared/models/data/base/UUIDEntityBase";

// A person can have multiple Identities.
export class PersonIdentity extends UUIDEntityBase implements IHasParentFK {
  ParentFK?: string; 
}

