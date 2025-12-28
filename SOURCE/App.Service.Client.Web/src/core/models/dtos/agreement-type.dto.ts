/**
 * Agreement Type Data Transfer Object
 * 
 * Represents a type of legal agreement.
 * Maps to: base_agreementTypes table in JSON-server
 * 
 * Parent entity for Agreements.
 * Examples: "Terms and Conditions"
 */
export interface AgreementTypeDto {
  id: string;
  title: string;
  languageCode: string;
  issuedUtc: string;
  text: string;
}
