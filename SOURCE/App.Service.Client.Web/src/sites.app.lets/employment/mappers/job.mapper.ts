import { JobDto } from '../models/dtos/job.dto';
import { JobViewModel } from '../models/view-models/job.view-model';

export function mapJobDtoToViewModel(dto: JobDto): JobViewModel {
  return {
    id: dto.id,
    enabled: dto.enabled ?? true,
    title: dto.title,
    company: dto.company,
    location: dto.location,
    salary: dto.salary,
    skills: dto.skills || [],
    logoUrl: dto.logo || '/assets/images/companies/default.png',
    isBookmarked: dto.bookmark ?? false,
    displayLabel: `${dto.title} at ${dto.company}`
  };
}

export function mapJobDtosToViewModels(dtos: JobDto[]): JobViewModel[] {
  return dtos.map(mapJobDtoToViewModel);
}

export function mapJobViewModelToDto(vm: JobViewModel): JobDto {
  return {
    id: vm.id,
    enabled: vm.enabled,
    title: vm.title,
    company: vm.company,
    location: vm.location,
    salary: vm.salary,
    skills: vm.skills,
    logo: vm.logoUrl,
    bookmark: vm.isBookmarked
  };
}
