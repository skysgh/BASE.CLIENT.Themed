/**
 * Contract for models that show a specific image file.
 * An example could be "hero.png".
 *
 * Important:
 * Prefer using ImageId, as leave as much information
 * on what to render to the Presentation layer, rather
 * that trying to dictate the outcome from the database laser.
 *
 * TODO: there are very good reasons to NOT bury
 * *rendering* information in a database record, but
 * don't have yet have a way to abstract that out yet.
 */


export interface IHasImageName {
    /** The filename of the image
     * including suffix, but not necessarily
     * full path (that generally would be
     * considered poor design/implementation)
     * Example:
     * ```hero.png```
     *
     * See:
     * IHasImageId and IHasIconId.
     */
    imageName: string;
}

