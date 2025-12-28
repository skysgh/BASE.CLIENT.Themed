import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ServiceFaqRepository } from './service-faq.repository';
import { ServiceFaqDto } from '../models/dtos/service-faq.dto';
import { SystemDiagnosticsTraceService } from '../services/system.diagnostics-trace.service';
import { SystemErrorService } from '../services/system.error.service';

describe('ServiceFaqRepository', () => {
  let repository: ServiceFaqRepository;
  let httpMock: HttpTestingController;
  let loggerSpy: jasmine.SpyObj<SystemDiagnosticsTraceService>;

  const mockFaqs: ServiceFaqDto[] = [
    {
      id: '1',
      enabled: true,
      title: 'What is BASE?',
      description: 'BASE is a platform',
      categoryId: 'general'
    },
    {
      id: '2',
      enabled: false,
      title: 'How to sign up?',
      description: 'Click sign up',
      categoryId: 'account'
    }
  ];

  beforeEach(() => {
    const loggerSpyObj = jasmine.createSpyObj('SystemDiagnosticsTraceService', ['debug', 'error']);
    const errorSpyObj = jasmine.createSpyObj('SystemErrorService', ['report']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ServiceFaqRepository,
        { provide: SystemDiagnosticsTraceService, useValue: loggerSpyObj },
        { provide: SystemErrorService, useValue: errorSpyObj }
      ]
    });

    repository = TestBed.inject(ServiceFaqRepository);
    httpMock = TestBed.inject(HttpTestingController);
    loggerSpy = TestBed.inject(SystemDiagnosticsTraceService) as jasmine.SpyObj<SystemDiagnosticsTraceService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  it('should get all FAQs', (done) => {
    repository.getAll().subscribe(faqs => {
      expect(faqs).toEqual(mockFaqs);
      done();
    });

    const req = httpMock.expectOne('/api/base_service_Faqs');
    expect(req.request.method).toBe('GET');
    req.flush(mockFaqs);
  });

  it('should get enabled FAQs', (done) => {
    const enabled = mockFaqs.filter(f => f.enabled);
    
    repository.getEnabled().subscribe(faqs => {
      expect(faqs.length).toBe(1);
      done();
    });

    const req = httpMock.expectOne('/api/base_service_Faqs?enabled=true');
    req.flush(enabled);
  });

  it('should get FAQs by category', (done) => {
    repository.getByCategory('general').subscribe(faqs => {
      expect(faqs).toBeTruthy();
      done();
    });

    const req = httpMock.expectOne('/api/base_service_Faqs?categoryId=general');
    req.flush([mockFaqs[0]]);
  });

  it('should get enabled FAQs by category', (done) => {
    repository.getEnabledByCategory('account').subscribe(faqs => {
      expect(faqs).toBeTruthy();
      done();
    });

    const req = httpMock.expectOne('/api/base_service_Faqs?categoryId=account&enabled=true');
    req.flush([]);
  });

  it('should handle errors', (done) => {
    repository.getAll().subscribe({
      next: () => fail('Should have errored'),
      error: (error) => {
        expect(error).toBeTruthy();
        done();
      }
    });

    const req = httpMock.expectOne('/api/base_service_Faqs');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
