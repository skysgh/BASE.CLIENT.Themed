/**
 * Service Statement View Model
 */
export interface ServiceStatementViewModel {
  id: string;
  typeId: string;
  typeName?: string;
  encodingTypeId: string;
  languageCode: string;
  issuedDate: Date;
  title: string;
  content: string;
  displayLabel: string;
  isHtml?: boolean;
  isMarkdown?: boolean;
}
