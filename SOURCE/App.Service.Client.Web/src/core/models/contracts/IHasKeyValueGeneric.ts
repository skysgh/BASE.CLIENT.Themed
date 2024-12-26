/**
 * Contract for entities that define both a key and value.
 *
 * Have used to define values for developing Urls.
 *
 * Warning:
 * But careful about reaching for this simple pattern
 * out of habit/lack of exposure to large mature systems,
 * when often an entity has multiple values/identifiers
 * and a join object is actually needed.
 * (eg: in a data hub, recording different service customer ids,
 * multiple jurisdictions/codesets, etc.)
 */

import { IHasGenericValue } from "./IHasGenericValue";


export interface IHasKeyValueGeneric<TValue> extends IHasGenericValue<TValue> {
    /**
     * key
     */
    key: string;
}
