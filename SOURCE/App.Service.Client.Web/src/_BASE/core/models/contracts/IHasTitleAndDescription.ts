/* Contract for a
   Required title and description
   ...which is most entities really

   See IHasEnabled, IHasFromToUtc
   which are used to make
   IHasUntenantedEnabledTitleAndDescription.

   See also IHasImageId.
   
*/
export interface IHasTitleAndDescription {
  title: string;
  description: string;
}

