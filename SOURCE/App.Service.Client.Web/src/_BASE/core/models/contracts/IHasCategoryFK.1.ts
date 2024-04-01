/**
 * @depracated.
 * While a Type is a single thing,
 * Things should be categorizable
 * as related to more than 1 thing,
 * and needs a join object to map it
 * correctly.
 *
 * ie, a Tag is a Category.
 */
export interface IHasCategoryFK {
    categoryFK: string;
}
