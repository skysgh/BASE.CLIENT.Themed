/**
 * Natural ordering of element that is rendered to screen.
 *
 * TODO: Order would be best if it were not in a data element,
 * as its purely a presentation layer concern.
 * (Then again the item is also sporting an ImageId
 * which is *also* a presentation layer concern...)
 */

export interface IHasNaturalOrder {
    order: number;
}
