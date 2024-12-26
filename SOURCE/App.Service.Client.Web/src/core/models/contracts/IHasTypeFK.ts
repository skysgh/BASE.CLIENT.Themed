/**
 * Contract for models that
 * require categorisation by Type.
 */

export interface IHasTypeFK {
    /** FK to reference data entity used to categorisation item.
     * 
     */
    typeFK: any;
}
