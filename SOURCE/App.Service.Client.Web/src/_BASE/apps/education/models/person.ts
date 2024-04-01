import { IsUUIDEntityBase } from "../../../core/models/data/base/IsUUIDEntityBase";
import { PersonIdentity } from "./personIdentity";

// There isn't too much to a person bar their projected Identities.
// That they may associate to different groups.
export class Person extends IsUUIDEntityBase {

  PersonIdentities?: PersonIdentity[];


}

