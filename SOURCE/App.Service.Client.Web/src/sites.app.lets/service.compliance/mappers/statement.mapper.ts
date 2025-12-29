import { StatementDto } from '../models/dtos/statement.dto';
import { StatementViewModel } from '../models/view-models/statement.view-model';

export function mapStatementDtoToViewModel(
  dto: StatementDto,
  typeCode: string = '',
  typeName: string = '',
  encodingCode: string = '',
  encodingName: string = '',
  mimeType: string = ''
): StatementViewModel {
  const now = new Date();
  const issuedAt = new Date(dto.issuedUtc);
  const effectiveAt = dto.effectiveUtc ? new Date(dto.effectiveUtc) : undefined;
  const expiresAt = dto.expiresUtc ? new Date(dto.expiresUtc) : undefined;
  
  const isExpired = expiresAt ? now > expiresAt : false;
  const isEffective = effectiveAt ? now >= effectiveAt && !isExpired : !isExpired;
  const isPdf = encodingCode.toUpperCase() === 'PDF' || mimeType === 'application/pdf';
  
  return {
    id: dto.id,
    enabled: dto.enabled,
    isAccountOverride: !!dto.accountFK,
    
    typeCode,
    typeName,
    encodingCode,
    encodingName,
    mimeType,
    
    languageCode: dto.languageCode,
    version: dto.version,
    title: dto.title,
    summary: dto.summary || '',
    text: dto.text,
    documentUrl: dto.documentUrl,
    
    issuedAt,
    effectiveAt,
    expiresAt,
    
    displayLabel: `${typeName} v${dto.version}`,
    isExpired,
    isEffective,
    isPdf
  };
}

export function mapStatementDtosToViewModels(dtos: StatementDto[]): StatementViewModel[] {
  // Note: In real usage, you'd join with type/encoding data
  return dtos.map(dto => mapStatementDtoToViewModel(dto));
}
