import { IHasId } from "../../../core/models/contracts/IHasId";

// A **displayable** model for backing Read Views of the entity.
export class SpikeDisplayable implements IHasId<any> {
  id?: any;
  givenName?: string;
  surName?: string;
  firstName?: string;
  lastName?: string;
  token?: string;
  email?: string;
}
