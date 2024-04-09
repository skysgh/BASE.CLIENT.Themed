//import { HasSummary } from "./core/SummaryItem";

import { IHasNumericValue } from "../contracts/IHasNumericValue";
import { SummaryItemBase } from "./base/SummaryItem";


/**
 * #### Description
 * a data model to capture stats about a system
 * (users, whatever) that can be displayed on
 * a pitch page.
 *
 * #### Related
 * See ServiceStatVTO
 */
export class ServiceStat extends SummaryItemBase
  implements IHasNumericValue {

  // Has Title and Description

  /** the prefix to render before the value */
  prefix!: string | null;
  /** the value to show */
  value!: number;
  /** the suffix to render after the value */
  suffix!: string | null;
  /** For Most stats this will be 0
   * but this may become needed at some point.
   */
  rounding!: number;
}

