import { 
  mapServiceFaqDtoToViewModel, 
  mapServiceFaqViewModelToDto,
  mapServiceFaqDtosToViewModels 
} from './service-faq.mapper';
import { ServiceFaqDto } from '../models/dtos/service-faq.dto';
import { ServiceFaqViewModel } from '../models/view-models/service-faq.view-model';

describe('ServiceFaq Mapper', () => {
  
  describe('mapServiceFaqDtoToViewModel', () => {
    
    it('should map all fields correctly', () => {
      const dto: ServiceFaqDto = {
        id: 'faq-1',
        enabled: true,
        title: 'What is BASE?',
        description: 'BASE is a platform...',
        categoryId: 'general'
      };

      const result = mapServiceFaqDtoToViewModel(dto);

      expect(result.id).toBe('faq-1');
      expect(result.enabled).toBe(true);
      expect(result.question).toBe('What is BASE?');
      expect(result.answer).toBe('BASE is a platform...');
      expect(result.categoryId).toBe('general');
    });

    it('should handle empty strings', () => {
      const dto: ServiceFaqDto = {
        id: 'faq-2',
        enabled: false,
        title: '',
        description: '',
        categoryId: ''
      };

      const result = mapServiceFaqDtoToViewModel(dto);

      expect(result.question).toBe('');
      expect(result.answer).toBe('');
      expect(result.categoryId).toBe('');
    });

    it('should preserve enabled false state', () => {
      const dto: ServiceFaqDto = {
        id: 'faq-3',
        enabled: false,
        title: 'Disabled Question',
        description: 'Disabled Answer',
        categoryId: 'test'
      };

      const result = mapServiceFaqDtoToViewModel(dto);

      expect(result.enabled).toBe(false);
    });
  });

  describe('mapServiceFaqViewModelToDto', () => {
    
    it('should map all fields correctly', () => {
      const vm: ServiceFaqViewModel = {
        id: 'faq-1',
        enabled: true,
        question: 'How do I sign up?',
        answer: 'Click the sign up button...',
        categoryId: 'account'
      };

      const result = mapServiceFaqViewModelToDto(vm);

      expect(result.id).toBe('faq-1');
      expect(result.enabled).toBe(true);
      expect(result.title).toBe('How do I sign up?');
      expect(result.description).toBe('Click the sign up button...');
      expect(result.categoryId).toBe('account');
    });

    it('should round-trip correctly', () => {
      const original: ServiceFaqDto = {
        id: 'faq-1',
        enabled: true,
        title: 'Test Question',
        description: 'Test Answer',
        categoryId: 'test'
      };

      const vm = mapServiceFaqDtoToViewModel(original);
      const result = mapServiceFaqViewModelToDto(vm);

      expect(result).toEqual(original);
    });
  });

  describe('mapServiceFaqDtosToViewModels', () => {
    
    it('should map empty array', () => {
      const result = mapServiceFaqDtosToViewModels([]);
      expect(result).toEqual([]);
    });

    it('should map array of DTOs', () => {
      const dtos: ServiceFaqDto[] = [
        {
          id: 'faq-1',
          enabled: true,
          title: 'Question 1',
          description: 'Answer 1',
          categoryId: 'cat1'
        },
        {
          id: 'faq-2',
          enabled: true,
          title: 'Question 2',
          description: 'Answer 2',
          categoryId: 'cat2'
        }
      ];

      const result = mapServiceFaqDtosToViewModels(dtos);

      expect(result.length).toBe(2);
      expect(result[0].question).toBe('Question 1');
      expect(result[1].question).toBe('Question 2');
    });

    it('should handle mixed enabled states', () => {
      const dtos: ServiceFaqDto[] = [
        {
          id: 'faq-1',
          enabled: true,
          title: 'Enabled',
          description: 'Answer',
          categoryId: 'cat1'
        },
        {
          id: 'faq-2',
          enabled: false,
          title: 'Disabled',
          description: 'Answer',
          categoryId: 'cat2'
        }
      ];

      const result = mapServiceFaqDtosToViewModels(dtos);

      expect(result[0].enabled).toBe(true);
      expect(result[1].enabled).toBe(false);
    });
  });
});
