/**
 * Agreement View Model
 */
export interface AgreementViewModel {
  id: string;
  typeId: string;
  typeName?: string;
  encodingTypeId: string;
  languageCode: string;
  issuedDate: Date;
  title: string;
  content: string;
  displayLabel: string;
}
