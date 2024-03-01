import { UUIDEntity } from "../../../common/models/UUIDEntity";
import { PersonIdentity } from "./personIdentity";

// There isn't too much to a person bar their projected Identities.
// That they may associate to different groups.
export class Person extends UUIDEntity {

  PersonIdentities?: PersonIdentity[];


}

