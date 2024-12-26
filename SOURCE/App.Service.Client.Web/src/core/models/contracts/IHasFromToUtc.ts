import { Data } from "@angular/router"

/**
 * Contract for models that
 * require indicating whether from when
 * till when it is valid.
 *
 * IMPORTANT:
 * A HUGELY important to put on options
 * to permit phasing out information,
 * while new information becomes available.
 *
 * IMPORTANT:
 * Everything SHOULD have a toUtc -- but
 * it's hard to put an end date on something
 * if there is no logic yet built to render
 * that something is expiring, or provide the
 * methods and UI to extend it.
 */
export interface IHasFromToUtc {
  fromUtc?: Date
  toUtc?: Date
}

