/**
 * Contract for entities that refer to
 * images by some form of textfragment
 * but not by the full filename.
 *
 * For example: 'china' or 'zh' and not 'china.jpg'
 *
 ** TODO: there are very good reasons to NOT bury
 * *rendering* information in a database record, but
 * don't have yet have a way to abstract that out yet.
 */

export interface IHasImageId {
  /**
   * The filename of the image, but without
   * a suffix ('ch' instead of 'ch.png').
   *
   * If suffix needs appending,
   * see IHasImageName.
   */
    imageId?: string;
}

