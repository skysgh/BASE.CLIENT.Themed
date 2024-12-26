import { IHasGenericValue } from "./IHasGenericValue";


/**
 * Contact to provide a value property.
 *
 * Note:
 * As non-generic, the type is 'any'.
 */
export interface IHasValue extends IHasGenericValue<any> {
}
