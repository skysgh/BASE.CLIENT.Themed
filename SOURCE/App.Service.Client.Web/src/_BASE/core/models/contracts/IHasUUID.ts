import { IHasId } from "./IHasId"

/**
 * UUID typed version of IHasId<T> interface
 * providing a UUID typed datastor Id property.
 *
 * Important:
 * ALthuogh it's often done, it's poor security process
 * to transmit outside of a service, to a client,
 * datastore Ids. At least XOR them with a secret  on the
 * way out and in again.
 */
export interface IHasUUID extends IHasId<string> {
}
