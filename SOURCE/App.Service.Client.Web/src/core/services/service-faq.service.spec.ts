import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ServiceFaqService } from './service-faq.service';
import { ServiceFaqRepository } from '../repositories/service-faq.repository';
import { SystemDiagnosticsTraceService } from './system.diagnostics-trace.service';
import { ServiceFaqDto } from '../models/dtos/service-faq.dto';

describe('ServiceFaqService', () => {
  let service: ServiceFaqService;
  let repoSpy: jasmine.SpyObj<ServiceFaqRepository>;
  let loggerSpy: jasmine.SpyObj<SystemDiagnosticsTraceService>;

  const mockDtos: ServiceFaqDto[] = [
    {
      id: '1',
      enabled: true,
      title: 'Question 1',
      description: 'Answer 1',
      categoryId: 'general'
    },
    {
      id: '2',
      enabled: false,
      title: 'Question 2',
      description: 'Answer 2',
      categoryId: 'account'
    }
  ];

  beforeEach(() => {
    const repoSpyObj = jasmine.createSpyObj('ServiceFaqRepository', ['getAll']);
    const loggerSpyObj = jasmine.createSpyObj('SystemDiagnosticsTraceService', ['debug', 'error']);

    TestBed.configureTestingModule({
      providers: [
        ServiceFaqService,
        { provide: ServiceFaqRepository, useValue: repoSpyObj },
        { provide: SystemDiagnosticsTraceService, useValue: loggerSpyObj }
      ]
    });

    repoSpy = TestBed.inject(ServiceFaqRepository) as jasmine.SpyObj<ServiceFaqRepository>;
    loggerSpy = TestBed.inject(SystemDiagnosticsTraceService) as jasmine.SpyObj<SystemDiagnosticsTraceService>;
    
    repoSpy.getAll.and.returnValue(of(mockDtos));
    service = TestBed.inject(ServiceFaqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load FAQs on init', () => {
    expect(service.faqs().length).toBe(2);
  });

  it('should compute enabled FAQs', () => {
    expect(service.enabledFaqs().length).toBe(1);
    expect(service.enabledFaqs()[0].question).toBe('Question 1');
  });

  it('should filter by category', () => {
    const result = service.getFaqsByCategory('general');
    expect(result.length).toBe(1);
    expect(result[0].categoryId).toBe('general');
  });

  it('should handle errors', () => {
    repoSpy.getAll.and.returnValue(throwError(() => new Error('Test error')));
    
    service.loadFaqs();
    
    expect(service.error()).toBe('Failed to load FAQs');
    expect(service.loading()).toBe(false);
  });

  it('should refresh FAQs', () => {
    service.refresh();
    expect(repoSpy.getAll).toHaveBeenCalled();
  });
});
