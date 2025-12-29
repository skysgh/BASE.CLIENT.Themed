export interface ServiceOperateLanguageViewModel {
  id: string;
  enabled: boolean;
  name: string;           // mapped from title
  nativeName: string;     // mapped from description
  languageCode: string;
  code: string;           // alias for languageCode (for backward compat)
  flagImageId: string;
  displayLabel: string;
}
