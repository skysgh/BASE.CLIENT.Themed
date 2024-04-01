import { IHasUntenantedEnabledTitleAndDescription } from "../contracts/IHasUntenantedEnabledTitleAndDescription";
import { IHasUntenantedReferenceData } from "../contracts/IHasUntenantedReferenceData";
import { HasUUIDEntityBase } from "./HasUUIDEntityBase";


/**
 * Contract for entities that have title and description (ie most)
 * but not necessarily a data entry, so leaves it up to implementor
 * to define Id type.
 */

export abstract class
  HasUntenantedEnabledTitleAndDescriptionBase
  extends HasUUIDEntityBase
  implements IHasUntenantedEnabledTitleAndDescription {

  // inherits id :string

    /**
     * Whether the option is enabled or not.
     * By default, enabled.
     */
    public enabled: boolean = true;

    /**
     * Visible Title of Item.
     * Required.
     *
     * Tip:
     * Recommend using an i18n registered key
     * and passing item through translate operation
     * before rendering.
     */
    public title!: string;
    /**
     * Description of item.
     * Required.
     */
    public description!: string;
}
