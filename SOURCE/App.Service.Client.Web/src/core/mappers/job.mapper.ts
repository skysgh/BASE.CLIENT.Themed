/**
 * Job Mapper
 * 
 * Pure functions to transform between DTO and ViewModel.
 * Handles image URL resolution and salary formatting.
 */

import { JobDto } from '../models/dtos/job.dto';
import { JobViewModel } from '../models/view-models/job.view-model';

/**
 * Map Job DTO to ViewModel
 * 
 * Transforms server data to UI-friendly format:
 * - Resolves image URLs
 * - Formats salary range
 * - Renames properties for clarity
 */
export function mapJobDtoToViewModel(dto: JobDto): JobViewModel {
  return {
    id: dto.id,
    title: dto.title || 'Untitled Position',
    description: dto.description || '',
    company: dto.company || 'Unknown Company',
    location: dto.locationFK || 'Location TBD',
    jobType: dto.typeFK || 'Not specified',
    salary: formatSalaryRange(dto.salaryRangeLower, dto.salaryRangeUpper),
    skills: dto.skill || [],
    imageUrl: resolveImageUrl(dto.imageName),
    isEnabled: dto.enabled ?? true,
    isBookmarked: dto.bookmark ?? false
  };
}

/**
 * Map multiple Job DTOs to ViewModels
 */
export function mapJobDtosToViewModels(dtos: JobDto[]): JobViewModel[] {
  return dtos.map(mapJobDtoToViewModel);
}

/**
 * Map Job ViewModel to DTO (for updates)
 * 
 * Transforms UI data back to server format.
 * Note: Some fields (like image paths) may need server-side handling.
 */
export function mapJobViewModelToDto(vm: JobViewModel): Partial<JobDto> {
  return {
    id: vm.id,
    title: vm.title,
    description: vm.description,
    company: vm.company,
    enabled: vm.isEnabled,
    bookmark: vm.isBookmarked,
    skill: vm.skills
    // Note: locationFK, typeFK, salary range, imageName need special handling
  };
}

/**
 * Format salary range for display
 * 
 * @param lower - Lower bound of salary range
 * @param upper - Upper bound of salary range
 * @returns Formatted salary string (e.g., "$40k - $60k" or "$50k+")
 */
function formatSalaryRange(lower?: number, upper?: number): string {
  if (!lower && !upper) {
    return 'Competitive';
  }
  
  if (lower && upper) {
    return `$${formatSalary(lower)} - $${formatSalary(upper)}`;
  }
  
  if (lower) {
    return `$${formatSalary(lower)}+`;
  }
  
  return `Up to $${formatSalary(upper!)}`;
}

/**
 * Format salary number to abbreviated string
 * 
 * @param amount - Salary amount
 * @returns Abbreviated string (e.g., 40000 → "40k")
 */
function formatSalary(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${Math.round(amount / 1000)}k`;
  }
  return amount.toString();
}

/**
 * Resolve image URL from image name
 * 
 * @param imageName - Image filename (optional)
 * @returns Full URL to image or default placeholder
 */
function resolveImageUrl(imageName?: string): string {
  if (!imageName) {
    return '/assets/deployed/images/companies/default-company.png';
  }
  
  // If already a full URL, return as-is
  if (imageName.startsWith('http://') || imageName.startsWith('https://') || imageName.startsWith('/')) {
    return imageName;
  }
  
  // Otherwise, resolve to deployed images path
  return `/assets/deployed/images/companies/${imageName}`;
}
