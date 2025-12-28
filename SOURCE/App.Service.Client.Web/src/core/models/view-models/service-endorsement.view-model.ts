/**
 * ServiceEndorsement ViewModel
 */
export interface ServiceEndorsementViewModel {
  id: string;
  quote: string;     // The testimonial text
  author: string;    // Person's name
  role: string;      // Their role/title
  enabled: boolean;
}
