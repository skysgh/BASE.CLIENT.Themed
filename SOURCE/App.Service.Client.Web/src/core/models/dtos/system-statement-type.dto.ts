/**
 * System Statement Type Data Transfer Object
 * 
 * Represents a type of legal/policy statement.
 * Maps to: base_system_StatementTypes table in JSON-server
 * 
 * Parent entity for ServiceStatements.
 * Examples: "Privacy", "Data Use", "Tracking"
 */
export interface SystemStatementTypeDto {
  id: string;
  title: string;
  description: string;
}
