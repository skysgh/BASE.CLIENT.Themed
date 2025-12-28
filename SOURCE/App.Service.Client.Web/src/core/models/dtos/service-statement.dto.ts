/**
 * Service Statement Data Transfer Object
 * 
 * Represents a legal/policy statement for a service.
 * Maps to: base_service_Statements table in JSON-server
 * 
 * Child entity of SystemStatementType.
 * Examples: "Privacy Statement", "Data Use Policy"
 */
export interface ServiceStatementDto {
  id: string;
  typeId: string;
  encodingTypeId: string;
  languageCode: string;
  issuedUtc: string;
  title: string;
  text: string;
}
