import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ServiceFeatureRepository } from './service-feature.repository';
import { ServiceFeatureDto } from '../models/dtos/service-feature.dto';
import { SystemDiagnosticsTraceService } from '../services/system.diagnostics-trace.service';
import { SystemErrorService } from '../services/system.error.service';

describe('ServiceFeatureRepository', () => {
  let repository: ServiceFeatureRepository;
  let httpMock: HttpTestingController;
  let loggerSpy: jasmine.SpyObj<SystemDiagnosticsTraceService>;
  let errorServiceSpy: jasmine.SpyObj<SystemErrorService>;

  const mockFeatures: ServiceFeatureDto[] = [
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
    }
  ];

  beforeEach(() => {
    const loggerSpyObj = jasmine.createSpyObj('SystemDiagnosticsTraceService', ['debug', 'error', 'info']);
    const errorSpyObj = jasmine.createSpyObj('SystemErrorService', ['handle']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ServiceFeatureRepository,
        { provide: SystemDiagnosticsTraceService, useValue: loggerSpyObj },
        { provide: SystemErrorService, useValue: errorSpyObj }
      ]
    });

    repository = TestBed.inject(ServiceFeatureRepository);
    httpMock = TestBed.inject(HttpTestingController);
    loggerSpy = TestBed.inject(SystemDiagnosticsTraceService) as jasmine.SpyObj<SystemDiagnosticsTraceService>;
    errorServiceSpy = TestBed.inject(SystemErrorService) as jasmine.SpyObj<SystemErrorService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Basic CRUD Operations', () => {
    
    it('should be created', () => {
      expect(repository).toBeTruthy();
    });

    it('should get all features', (done) => {
      repository.getAll().subscribe(features => {
        expect(features).toEqual(mockFeatures);
        expect(features.length).toBe(2);
        done();
      });

      const req = httpMock.expectOne('/api/base_service_Features');
      expect(req.request.method).toBe('GET');
      req.flush(mockFeatures);
    });

    it('should get feature by ID', (done) => {
      const mockFeature = mockFeatures[0];

      repository.getById('1').subscribe(feature => {
        expect(feature).toEqual(mockFeature);
        done();
      });

      const req = httpMock.expectOne('/api/base_service_Features/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockFeature);
    });

    it('should create new feature', (done) => {
      const newFeature: Partial<ServiceFeatureDto> = {
        serviceId: 'service-1',
        enabled: true,
        title: 'New Feature',
        description: 'New Description'
      };

      const createdFeature: ServiceFeatureDto = {
        id: '3',
        serviceId: 'service-1',
        enabled: true,
        title: 'New Feature',
        description: 'New Description',
        imageId: undefined
      };

      repository.create(newFeature).subscribe(feature => {
        expect(feature).toEqual(createdFeature);
        done();
      });

      const req = httpMock.expectOne('/api/base_service_Features');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newFeature);
      req.flush(createdFeature);
    });

    it('should update existing feature', (done) => {
      const updates: Partial<ServiceFeatureDto> = {
        title: 'Updated Title'
      };

      const updatedFeature: ServiceFeatureDto = {
        ...mockFeatures[0],
        ...updates
      };

      repository.update('1', updates).subscribe(feature => {
        expect(feature.title).toBe('Updated Title');
        done();
      });

      const req = httpMock.expectOne('/api/base_service_Features/1');
      expect(req.request.method).toBe('PUT');
      req.flush(updatedFeature);
    });

    it('should delete feature', (done) => {
      repository.delete('1').subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      const req = httpMock.expectOne('/api/base_service_Features/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('Custom Query Methods', () => {
    
    it('should get only enabled features', (done) => {
      const enabledFeatures = mockFeatures.filter(f => f.enabled);

      repository.getEnabled().subscribe(features => {
        expect(features.length).toBe(1);
        expect(features[0].enabled).toBe(true);
        done();
      });

      const req = httpMock.expectOne('/api/base_service_Features?enabled=true');
      expect(req.request.method).toBe('GET');
      req.flush(enabledFeatures);
    });

    it('should get features by service ID', (done) => {
      repository.getByServiceId('service-1').subscribe(features => {
        expect(features).toEqual(mockFeatures);
        done();
      });

      const req = httpMock.expectOne('/api/base_service_Features?serviceId=service-1');
      expect(req.request.method).toBe('GET');
      req.flush(mockFeatures);
    });

    it('should get enabled features by service ID', (done) => {
      const enabledFeatures = mockFeatures.filter(f => f.enabled);

      repository.getEnabledByServiceId('service-1').subscribe(features => {
        expect(features.length).toBe(1);
        done();
      });

      const req = httpMock.expectOne('/api/base_service_Features?serviceId=service-1&enabled=true');
      expect(req.request.method).toBe('GET');
      req.flush(enabledFeatures);
    });

    it('should toggle feature enabled state', (done) => {
      const toggledFeature = { ...mockFeatures[1], enabled: true };

      repository.toggleEnabled('2', true).subscribe(feature => {
        expect(feature.enabled).toBe(true);
        done();
      });

      const req = httpMock.expectOne('/api/base_service_Features/2');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ enabled: true });
      req.flush(toggledFeature);
    });
  });

  describe('Pagination', () => {
    
    it('should get paginated features', (done) => {
      repository.getPage(1, 10).subscribe(features => {
        expect(features).toEqual(mockFeatures);
        done();
      });

      const req = httpMock.expectOne('/api/base_service_Features?page=1&_per_page=10');
      expect(req.request.method).toBe('GET');
      req.flush(mockFeatures);
    });
  });

  describe('Error Handling', () => {
    
    it('should handle HTTP errors', (done) => {
      repository.getAll().subscribe({
        next: () => fail('Should have errored'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(loggerSpy.error).toHaveBeenCalled();
          done();
        }
      });

      const req = httpMock.expectOne('/api/base_service_Features');
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });

    it('should retry failed requests once', () => {
      repository.getAll().subscribe({
        next: () => fail('Should have errored'),
        error: () => {
          // Expected to error after retry
        }
      });

      // First attempt
      const req1 = httpMock.expectOne('/api/base_service_Features');
      req1.flush('Error', { status: 500, statusText: 'Server Error' });

      // Retry attempt
      const req2 = httpMock.expectOne('/api/base_service_Features');
      req2.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('Logging', () => {
    
    it('should log operations', (done) => {
      repository.getAll().subscribe(() => {
        expect(loggerSpy.debug).toHaveBeenCalled();
        done();
      });

      const req = httpMock.expectOne('/api/base_service_Features');
      req.flush(mockFeatures);
    });
  });
});
