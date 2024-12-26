export interface SystemDbStorageFieldNames {
  id: string;
  fKSuffix: string;
  timestamp: string;
  enabled: string;
  fromUtc: string;
  toUtc: string;
  stateFK: string;
  serviceFK: string;
  tenancyFK: string;
  parentFK: string;
  title: string;
  description: string;
  languageCode: string;
  preferred: string;
  defaultDisplayOrder: string;
}
