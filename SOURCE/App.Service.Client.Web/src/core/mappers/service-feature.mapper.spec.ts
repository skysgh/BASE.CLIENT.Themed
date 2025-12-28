import { 
  mapServiceFeatureDtoToViewModel,
  mapServiceFeatureViewModelToDto,
  mapServiceFeatureDtosToViewModels,
  mapServiceFeatureViewModelsToDtos
} from './service-feature.mapper';
import { ServiceFeatureDto } from '../models/dtos/service-feature.dto';
import { ServiceFeatureViewModel } from '../models/view-models/service-feature.view-model';

describe('ServiceFeature Mapper', () => {
  
  describe('mapServiceFeatureDtoToViewModel', () => {
    
    it('should map DTO to ViewModel correctly', () => {
      const dto: ServiceFeatureDto = {
        id: 'test-123',
        serviceId: 'service-456',
        enabled: true,
        title: 'Test Feature',
        description: 'Test Description',
        imageId: 'test.svg'
      };

      const vm = mapServiceFeatureDtoToViewModel(dto);

      expect(vm.id).toBe('test-123');
      expect(vm.serviceId).toBe('service-456');
      expect(vm.isEnabled).toBe(true);
      expect(vm.title).toBe('Test Feature');
      expect(vm.description).toBe('Test Description');
      expect(vm.imageUrl).toBe('/assets/features/test.svg');
      expect(vm.cssClass).toContain('feature');
    });

    it('should handle missing imageId with default', () => {
      const dto: ServiceFeatureDto = {
        id: 'test-123',
        serviceId: 'service-456',
        enabled: true,
        title: 'Test Feature',
        description: 'Test Description'
      };

      const vm = mapServiceFeatureDtoToViewModel(dto);

      expect(vm.imageUrl).toBe('/assets/features/default.svg');
    });

    it('should add disabled CSS class when enabled is false', () => {
      const dto: ServiceFeatureDto = {
        id: 'test-123',
        serviceId: 'service-456',
        enabled: false,
        title: 'Test Feature',
        description: 'Test Description'
      };

      const vm = mapServiceFeatureDtoToViewModel(dto);

      expect(vm.isEnabled).toBe(false);
      expect(vm.cssClass).toContain('feature--disabled');
    });

    it('should preserve imageId if it is already a URL', () => {
      const dto: ServiceFeatureDto = {
        id: 'test-123',
        serviceId: 'service-456',
        enabled: true,
        title: 'Test Feature',
        description: 'Test Description',
        imageId: 'https://example.com/image.png'
      };

      const vm = mapServiceFeatureDtoToViewModel(dto);

      expect(vm.imageUrl).toBe('https://example.com/image.png');
    });
  });

  describe('mapServiceFeatureViewModelToDto', () => {
    
    it('should map ViewModel to DTO correctly', () => {
      const vm: ServiceFeatureViewModel = {
        id: 'test-123',
        serviceId: 'service-456',
        isEnabled: true,
        title: 'Test Feature',
        description: 'Test Description',
        imageUrl: '/assets/features/test.svg',
        cssClass: 'feature'
      };

      const dto = mapServiceFeatureViewModelToDto(vm);

      expect(dto.id).toBe('test-123');
      expect(dto.serviceId).toBe('service-456');
      expect(dto.enabled).toBe(true);
      expect(dto.title).toBe('Test Feature');
      expect(dto.description).toBe('Test Description');
      expect(dto.imageId).toBe('test.svg');
    });

    it('should extract imageId from URL path', () => {
      const vm: ServiceFeatureViewModel = {
        id: 'test-123',
        serviceId: 'service-456',
        isEnabled: true,
        title: 'Test Feature',
        description: 'Test Description',
        imageUrl: '/assets/features/analytics.svg'
      };

      const dto = mapServiceFeatureViewModelToDto(vm);

      expect(dto.imageId).toBe('analytics.svg');
    });

    it('should return undefined imageId for default image', () => {
      const vm: ServiceFeatureViewModel = {
        id: 'test-123',
        serviceId: 'service-456',
        isEnabled: true,
        title: 'Test Feature',
        description: 'Test Description',
        imageUrl: '/assets/features/default.svg'
      };

      const dto = mapServiceFeatureViewModelToDto(vm);

      expect(dto.imageId).toBeUndefined();
    });
  });

  describe('mapServiceFeatureDtosToViewModels', () => {
    
    it('should map array of DTOs to ViewModels', () => {
      const dtos: ServiceFeatureDto[] = [
        {
          id: 'test-1',
          serviceId: 'service-1',
          enabled: true,
          title: 'Feature 1',
          description: 'Description 1',
          imageId: 'img1.svg'
        },
        {
          id: 'test-2',
          serviceId: 'service-2',
          enabled: false,
          title: 'Feature 2',
          description: 'Description 2',
          imageId: 'img2.svg'
        }
      ];

      const vms = mapServiceFeatureDtosToViewModels(dtos);

      expect(vms.length).toBe(2);
      expect(vms[0].id).toBe('test-1');
      expect(vms[0].isEnabled).toBe(true);
      expect(vms[1].id).toBe('test-2');
      expect(vms[1].isEnabled).toBe(false);
    });

    it('should handle empty array', () => {
      const vms = mapServiceFeatureDtosToViewModels([]);
      expect(vms).toEqual([]);
    });
  });

  describe('mapServiceFeatureViewModelsToDtos', () => {
    
    it('should map array of ViewModels to DTOs', () => {
      const vms: ServiceFeatureViewModel[] = [
        {
          id: 'test-1',
          serviceId: 'service-1',
          isEnabled: true,
          title: 'Feature 1',
          description: 'Description 1',
          imageUrl: '/assets/features/img1.svg'
        },
        {
          id: 'test-2',
          serviceId: 'service-2',
          isEnabled: false,
          title: 'Feature 2',
          description: 'Description 2',
          imageUrl: '/assets/features/img2.svg'
        }
      ];

      const dtos = mapServiceFeatureViewModelsToDtos(vms);

      expect(dtos.length).toBe(2);
      expect(dtos[0].id).toBe('test-1');
      expect(dtos[0].enabled).toBe(true);
      expect(dtos[1].id).toBe('test-2');
      expect(dtos[1].enabled).toBe(false);
    });

    it('should handle empty array', () => {
      const dtos = mapServiceFeatureViewModelsToDtos([]);
      expect(dtos).toEqual([]);
    });
  });

  describe('Roundtrip mapping', () => {
    
    it('should preserve data through DTO -> VM -> DTO roundtrip', () => {
      const originalDto: ServiceFeatureDto = {
        id: 'test-123',
        serviceId: 'service-456',
        enabled: true,
        title: 'Test Feature',
        description: 'Test Description',
        imageId: 'test.svg'
      };

      const vm = mapServiceFeatureDtoToViewModel(originalDto);
      const resultDto = mapServiceFeatureViewModelToDto(vm);

      expect(resultDto.id).toBe(originalDto.id);
      expect(resultDto.serviceId).toBe(originalDto.serviceId);
      expect(resultDto.enabled).toBe(originalDto.enabled);
      expect(resultDto.title).toBe(originalDto.title);
      expect(resultDto.description).toBe(originalDto.description);
      expect(resultDto.imageId).toBe(originalDto.imageId);
    });
  });
});
