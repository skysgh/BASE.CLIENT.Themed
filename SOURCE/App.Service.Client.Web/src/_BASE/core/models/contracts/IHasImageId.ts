/**
 * Contract for entities that refer to
 * images by some form of textfragment
 * but not by the filename.
 *
 * For example: 'china' or 'zh' and not 'china.jpg'
 */

export interface IHasImageId {
    imageId?: string;
}
