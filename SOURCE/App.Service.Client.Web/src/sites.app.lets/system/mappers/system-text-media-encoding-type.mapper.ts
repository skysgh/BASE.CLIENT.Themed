import { SystemTextMediaEncodingTypeDto } from '../models/dtos/system-text-media-encoding-type.dto';
import { SystemTextMediaEncodingTypeViewModel } from '../models/view-models/system-text-media-encoding-type.view-model';

export function mapSystemTextMediaEncodingTypeDtoToViewModel(dto: SystemTextMediaEncodingTypeDto): SystemTextMediaEncodingTypeViewModel {
  return {
    id: dto.id,
    code: dto.code,
    title: dto.title,
    description: dto.description,
    displayLabel: dto.title
  };
}

export function mapSystemTextMediaEncodingTypeDtosToViewModels(dtos: SystemTextMediaEncodingTypeDto[]): SystemTextMediaEncodingTypeViewModel[] {
  return dtos.map(mapSystemTextMediaEncodingTypeDtoToViewModel);
}
