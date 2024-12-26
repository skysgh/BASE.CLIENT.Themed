import { ReferenceData } from "../../../../core/models/data/reference-item.model";
import { PlaceType } from "./placeType";

// A **raw** model for interoperability
// and sometimes backing Edit Views of the entity.
export class Place extends ReferenceData {
  // A place can be multiple types.
  public types?: PlaceType[];
}

