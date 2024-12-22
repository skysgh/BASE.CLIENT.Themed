import { HasUUIDEntityBase } from "../../../core/models/base/HasUUIDEntityBase";
import { PersonIdentity } from "./personIdentity";

// There isn't too much to a person bar their projected Identities.
// That they may associate to different groups.
export class Person extends HasUUIDEntityBase {

  PersonIdentities?: PersonIdentity[];


}

