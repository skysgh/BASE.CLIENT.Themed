import { IHasId } from "../../../common/contracts/IHasId";

// A **displayable** model for backing Read Views of the entity.
export class SpikeDisplayable {
  id?: number;
  givenName?: string;
  surName?: string;
  firstName?: string;
  lastName?: string;
  token?: string;
  email?: string;
}
