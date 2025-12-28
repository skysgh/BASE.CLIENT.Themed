/**
 * Service Text Media Encoding Type Data Transfer Object
 * 
 * Represents a text/media encoding format type.
 * Maps to: base_service_TextMediaEncodingTypes table in JSON-server
 * 
 * Used to specify how text content is encoded (HTML, Markdown, etc.)
 * Examples: "HTML", "Markdown"
 */
export interface ServiceTextMediaEncodingTypeDto {
  id: string;
  serviceId: string;
  title: string;
  description: string;
}
