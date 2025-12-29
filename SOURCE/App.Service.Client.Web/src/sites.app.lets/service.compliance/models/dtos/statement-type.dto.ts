/**
 * Statement Type DTO
 * 
 * Reference data for types of legal/compliance statements.
 * Examples: PRIVACY, TERMS, DATA_USE, COOKIE, ACCESSIBILITY
 */
export interface StatementTypeDto {
  id: string;
  enabled: boolean;
  code: string;
  title: string;
  description: string;
  displayOrder?: number;
}
