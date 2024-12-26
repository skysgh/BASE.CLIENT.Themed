/**
 * Contract to indicate that the item is new
 * (useful to highlight a new offering, etc.)
 */

export interface IHasNew {
    /**
     * A flag that can be used to render
     * a newly introduced list item as
     * New/highlighted.
     */
    isNewUntil?: Date;

}
