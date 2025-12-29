/**
 * Text Media Encoding Type DTO
 * 
 * Reference data for document encoding formats.
 * Examples: PDF, HTML, MARKDOWN, PLAIN_TEXT
 */
export interface TextMediaEncodingTypeDto {
  id: string;
  enabled: boolean;
  code: string;
  title: string;
  description: string;
  mimeType: string;
  fileExtension: string;
}
