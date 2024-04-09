/** Contract to indicate the item is
 *  the preferred option from a list.
 *
 * Useful to render pricing plans, etc.
 */

export interface IHasPreferredOption {
    /** A flag to indicate that an item
     * is the preferred option from a  list.
     *
     */
    isPreferred: boolean;
}
