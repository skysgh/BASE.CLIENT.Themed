/**
 * Service Text Media Encoding Type View Model
 * 
 * UI-friendly representation of a text encoding type.
 */
export interface ServiceTextMediaEncodingTypeViewModel {
  id: string;
  serviceId: string;
  title: string;
  description: string;
  displayLabel: string;
  isHtml?: boolean;
  isMarkdown?: boolean;
}
