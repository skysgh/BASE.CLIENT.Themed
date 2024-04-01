/**
 * Contract for providing a reference to an Icon
 * @deprecated The method should not be used.
 * Use IHasImageId, as the renderering logic will know
 * what to do with the information, and whether to
 * treat it as an icon or image.
 * TODO: there's also a lot of reasons to NOT bury
 * rendering logic in a database record, but
 * don't have yet have a way to abstract that out
 */
//export interface IHasIconId {

//    /** Textual identifier of Icon to display */
//  imageId?: string;
//}
