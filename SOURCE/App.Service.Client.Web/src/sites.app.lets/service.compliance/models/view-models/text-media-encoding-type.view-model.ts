/**
 * Text Media Encoding Type ViewModel
 */
export interface TextMediaEncodingTypeViewModel {
  id: string;
  enabled: boolean;
  code: string;
  name: string;
  description: string;
  mimeType: string;
  fileExtension: string;
  displayLabel: string;
  isPdf: boolean;
  isHtml: boolean;
  isMarkdown: boolean;
}
