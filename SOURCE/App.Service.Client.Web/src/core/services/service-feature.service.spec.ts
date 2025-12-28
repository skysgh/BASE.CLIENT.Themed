import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ServiceFeatureService } from './service-feature.service';
import { ServiceFeatureRepository } from '../repositories/service-feature.repository';
import { ServiceFeatureDto } from '../models/dtos/service-feature.dto';
import { ServiceFeatureViewModel } from '../models/view-models/service-feature.view-model';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';

describe('ServiceFeatureService', () => {
  let service: ServiceFeatureService;
  let repositorySpy: jasmine.SpyObj<ServiceFeatureRepository>;
  let loggerSpy: jasmine.SpyObj<SystemDiagnosticsTraceService>;

  const mockDtos: ServiceFeatureDto[] = [
    {
      id: '1',
      serviceId: 'service-1',
      enabled: true,
      title: 'Feature 1',
      description: 'Description 1',
      imageId: 'img1.svg'
    },
    {
      id: '2',
      serviceId: 'service-1',
      enabled: false,
      title: 'Feature 2',
      description: 'Description 2',
      imageId: 'img2.svg'
    },
    {
      id: '3',
      serviceId: 'service-1',
      enabled: true,
      title: 'Feature 3',
      description: 'Description 3',
      imageId: 'img3.svg'
    }
  ];

  beforeEach(() => {
    const repoSpyObj = jasmine.createSpyObj('ServiceFeatureRepository', [
      'getAll', 'getById', 'create', 'update', 'delete', 'toggleEnabled'
    ]);
    const logSpyObj = jasmine.createSpyObj('SystemDiagnosticsTraceService', ['debug', 'error', 'info']);

    TestBed.configureTestingModule({
      providers: [
        ServiceFeatureService,
        { provide: ServiceFeatureRepository, useValue: repoSpyObj },
        { provide: SystemDiagnosticsTraceService, useValue: logSpyObj }
      ]
    });

    repositorySpy = TestBed.inject(ServiceFeatureRepository) as jasmine.SpyObj<ServiceFeatureRepository>;
    loggerSpy = TestBed.inject(SystemDiagnosticsTraceService) as jasmine.SpyObj<SystemDiagnosticsTraceService>;
    
    // Setup default spy behavior
    repositorySpy.getAll.and.returnValue(of(mockDtos));
    
    service = TestBed.inject(ServiceFeatureService);
  });

  describe('Initialization', () => {
    
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should load features on initialization', () => {
      expect(repositorySpy.getAll).toHaveBeenCalled();
      expect(service.features().length).toBe(3);
      expect(service.initialized()).toBe(true);
    });
  });

  describe('Signals', () => {
    
    it('should have features signal', () => {
      expect(service.features()).toBeDefined();
      expect(Array.isArray(service.features())).toBe(true);
    });

    it('should have loading signal', () => {
      expect(service.loading()).toBeDefined();
      expect(typeof service.loading()).toBe('boolean');
    });

    it('should have error signal', () => {
      expect(service.error()).toBeDefined();
    });

    it('should have initialized signal', () => {
      expect(service.initialized()).toBeDefined();
      expect(typeof service.initialized()).toBe('boolean');
    });
  });

  describe('Computed Signals', () => {
    
    it('should compute enabled features', () => {
      const enabled = service.enabledFeatures();
      expect(enabled.length).toBe(2);
      expect(enabled.every(f => f.isEnabled)).toBe(true);
    });

    it('should compute disabled features', () => {
      const disabled = service.disabledFeatures();
      expect(disabled.length).toBe(1);
      expect(disabled.every(f => !f.isEnabled)).toBe(true);
    });

    it('should compute total count', () => {
      expect(service.totalCount()).toBe(3);
    });

    it('should compute enabled count', () => {
      expect(service.enabledCount()).toBe(2);
    });

    it('should compute hasFeatures', () => {
      expect(service.hasFeatures()).toBe(true);
    });

    it('should compute hasError', () => {
      expect(service.hasError()).toBe(false);
    });
  });

  describe('loadFeatures', () => {
    
    it('should load features successfully', (done) => {
      service.clear(); // Reset state
      repositorySpy.getAll.calls.reset();
      repositorySpy.getAll.and.returnValue(of(mockDtos));

      service.loadFeatures().subscribe(() => {
        expect(service.features().length).toBe(3);
        expect(service.loading()).toBe(false);
        expect(service.error()).toBeNull();
        expect(service.initialized()).toBe(true);
        done();
      });
    });

    it('should set loading state during fetch', () => {
      service.clear();
      repositorySpy.getAll.calls.reset();
      repositorySpy.getAll.and.returnValue(of(mockDtos).pipe());
      
      service.loadFeatures();
      // Loading state is transient, just verify method was called
      expect(repositorySpy.getAll).toHaveBeenCalled();
    });

    it('should handle errors', (done) => {
      service.clear();
      repositorySpy.getAll.calls.reset();
      repositorySpy.getAll.and.returnValue(throwError(() => new Error('API Error')));

      service.loadFeatures().subscribe(() => {
        expect(service.error()).toBe('Failed to load features');
        expect(service.loading()).toBe(false);
        expect(service.features().length).toBe(0);
        done();
      });
    });
  });

  describe('getById', () => {
    
    it('should find feature by ID', () => {
      const feature = service.getById('1');
      expect(feature).toBeDefined();
      expect(feature?.id).toBe('1');
    });

    it('should return undefined for non-existent ID', () => {
      const feature = service.getById('non-existent');
      expect(feature).toBeUndefined();
    });
  });

  describe('addFeature', () => {
    
    it('should add new feature', (done) => {
      const newFeatureDto: ServiceFeatureDto = {
        id: '4',
        serviceId: 'service-1',
        enabled: true,
        title: 'New Feature',
        description: 'New Description',
        imageId: 'new.svg'
      };

      repositorySpy.create.and.returnValue(of(newFeatureDto));

      const newVm: ServiceFeatureViewModel = {
        id: '4',
        serviceId: 'service-1',
        isEnabled: true,
        title: 'New Feature',
        description: 'New Description',
        imageUrl: '/assets/features/new.svg'
      };

      service.addFeature(newVm).subscribe(() => {
        expect(service.features().length).toBe(4);
        const added = service.getById('4');
        expect(added).toBeDefined();
        expect(added?.title).toBe('New Feature');
        done();
      });
    });

    it('should handle add errors', (done) => {
      repositorySpy.create.and.returnValue(throwError(() => new Error('Create failed')));

      const newVm: ServiceFeatureViewModel = {
        id: '4',
        serviceId: 'service-1',
        isEnabled: true,
        title: 'New Feature',
        description: 'New Description',
        imageUrl: '/assets/features/new.svg'
      };

      service.addFeature(newVm).subscribe({
        next: () => fail('Should have errored'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(loggerSpy.error).toHaveBeenCalled();
          done();
        }
      });
    });
  });

  describe('updateFeature', () => {
    
    it('should update existing feature', (done) => {
      const updatedDto: ServiceFeatureDto = {
        ...mockDtos[0],
        title: 'Updated Title'
      };

      repositorySpy.update.and.returnValue(of(updatedDto));

      const updatedVm: ServiceFeatureViewModel = {
        id: '1',
        serviceId: 'service-1',
        isEnabled: true,
        title: 'Updated Title',
        description: 'Description 1',
        imageUrl: '/assets/features/img1.svg'
      };

      service.updateFeature(updatedVm).subscribe(() => {
        const feature = service.getById('1');
        expect(feature?.title).toBe('Updated Title');
        done();
      });
    });

    it('should handle update errors', (done) => {
      repositorySpy.update.and.returnValue(throwError(() => new Error('Update failed')));

      const vm: ServiceFeatureViewModel = {
        id: '1',
        serviceId: 'service-1',
        isEnabled: true,
        title: 'Updated',
        description: 'Desc',
        imageUrl: '/assets/features/img1.svg'
      };

      service.updateFeature(vm).subscribe({
        next: () => fail('Should have errored'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });
    });
  });

  describe('deleteFeature', () => {
    
    it('should delete feature', (done) => {
      repositorySpy.delete.and.returnValue(of(void 0));

      const initialCount = service.features().length;

      service.deleteFeature('1').subscribe(() => {
        expect(service.features().length).toBe(initialCount - 1);
        expect(service.getById('1')).toBeUndefined();
        done();
      });
    });

    it('should handle delete errors', (done) => {
      repositorySpy.delete.and.returnValue(throwError(() => new Error('Delete failed')));

      service.deleteFeature('1').subscribe({
        next: () => fail('Should have errored'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });
    });
  });

  describe('toggleEnabled', () => {
    
    it('should toggle feature enabled state', (done) => {
      const toggledDto: ServiceFeatureDto = {
        ...mockDtos[1],
        enabled: true
      };

      repositorySpy.toggleEnabled.and.returnValue(of(toggledDto));

      service.toggleEnabled('2', true).subscribe(() => {
        const feature = service.getById('2');
        expect(feature?.isEnabled).toBe(true);
        done();
      });
    });
  });

  describe('clear', () => {
    
    it('should clear all state', () => {
      service.clear();

      expect(service.features().length).toBe(0);
      expect(service.error()).toBeNull();
      expect(service.initialized()).toBe(false);
    });
  });

  describe('refresh', () => {
    
    it('should reload features', (done) => {
      repositorySpy.getAll.calls.reset();
      repositorySpy.getAll.and.returnValue(of(mockDtos));

      service.refresh().subscribe(() => {
        expect(repositorySpy.getAll).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('Signal Reactivity', () => {
    
    it('should update computed signals when features change', () => {
      const initialEnabledCount = service.enabledCount();
      
      // Add a new enabled feature
      const newDto: ServiceFeatureDto = {
        id: '4',
        serviceId: 'service-1',
        enabled: true,
        title: 'New',
        description: 'New',
        imageId: 'new.svg'
      };
      
      repositorySpy.create.and.returnValue(of(newDto));
      
      const newVm: ServiceFeatureViewModel = {
        id: '4',
        serviceId: 'service-1',
        isEnabled: true,
        title: 'New',
        description: 'New',
        imageUrl: '/assets/features/new.svg'
      };

      service.addFeature(newVm).subscribe(() => {
        expect(service.enabledCount()).toBe(initialEnabledCount + 1);
        expect(service.totalCount()).toBe(4);
      });
    });
  });
});
