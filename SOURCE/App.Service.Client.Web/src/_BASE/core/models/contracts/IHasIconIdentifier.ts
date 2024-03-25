/**
 * Contract for models that display a font or class based icon.
 */
export interface IHasIconIdentifier {
    ///**
    // * Definately early, but I'd expect
    // * that the font library to be updated
    // * over time?
    // */
    //iconLibraryName: string;
    /**
     * The name to use to render the font icon.
     */
    iconId: string;
}
