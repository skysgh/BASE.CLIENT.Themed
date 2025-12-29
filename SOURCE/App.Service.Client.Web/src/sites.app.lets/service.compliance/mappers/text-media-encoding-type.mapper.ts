import { TextMediaEncodingTypeDto } from '../models/dtos/text-media-encoding-type.dto';
import { TextMediaEncodingTypeViewModel } from '../models/view-models/text-media-encoding-type.view-model';

export function mapTextMediaEncodingTypeDtoToViewModel(dto: TextMediaEncodingTypeDto): TextMediaEncodingTypeViewModel {
  const code = dto.code.toUpperCase();
  return {
    id: dto.id,
    enabled: dto.enabled,
    code: dto.code,
    name: dto.title,
    description: dto.description,
    mimeType: dto.mimeType,
    fileExtension: dto.fileExtension,
    displayLabel: `${dto.title} (${dto.fileExtension})`,
    isPdf: code === 'PDF',
    isHtml: code === 'HTML',
    isMarkdown: code === 'MARKDOWN' || code === 'MD'
  };
}

export function mapTextMediaEncodingTypeDtosToViewModels(dtos: TextMediaEncodingTypeDto[]): TextMediaEncodingTypeViewModel[] {
  return dtos.map(mapTextMediaEncodingTypeDtoToViewModel);
}
