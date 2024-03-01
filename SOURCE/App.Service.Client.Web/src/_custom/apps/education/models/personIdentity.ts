import { IHasParentFK } from "../../../common/contracts/IHasParentFK";
import { UUIDEntity } from "../../../common/models/UUIDEntity";

// A person can have multiple Identities.
export class PersonIdentity extends UUIDEntity implements IHasParentFK {
  ParentFK?: string; 
}

