/**
 * Agreement Data Transfer Object
 * 
 * Represents a legal agreement document.
 * Maps to: base_agreements table in JSON-server
 * 
 * Child entity of AgreementType.
 */
export interface AgreementDto {
  id: string;
  typeId: string;
  encodingTypeId: string;
  languageCode: string;
  issuedUtc: string;
  title: string;
  text: string;
}
