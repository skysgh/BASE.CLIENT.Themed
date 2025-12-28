/**
 * ServiceEndorsement DTO
 * 
 * Testimonials/quotes from users about the service.
 */
export interface ServiceEndorsementDto {
  id: string;
  enabled: boolean;
  title: string;
  description: string;
  by: string;        // Person's name
  role: string;      // Their role/title
}
