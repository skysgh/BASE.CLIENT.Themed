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
export interface IHasId<TId> {

  /**
   * A datastore Id.
   * Preferably always UUID based, as oppossed to integers
   * which generally prove unscalable beyond trivial applications
   * running on single devices.
   *
   * Required.
   * 
   * Important:
   * ALthuogh it's often done, it's poor security process
   * to transmit outside of a service, to a client,
   * datastore Ids. At least XOR them with a secret  on the
   * way out and in again.
   */
  id?: TId;
}


