import { IHasParentFK } from "../../../core/models/contracts/IHasParentFK";
import { UUIDEntityBase } from "../../../core/models/data/base/UUIDEntityBase";

// A person can have multiple Identities.
export class PersonIdentity extends UUIDEntityBase implements IHasParentFK {
  ParentFK?: string; 
}

