import { IHasParentFK } from "../../../core/models/contracts/IHasParentFK";
import { IsUUIDEntityBase } from "../../../core/models/data/base/IsUUIDEntityBase";

// A person can have multiple Identities.
export class PersonIdentity extends IsUUIDEntityBase implements IHasParentFK {
  ParentFK?: string; 
}

