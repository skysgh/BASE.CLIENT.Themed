import { 
  mapServiceEndorsementDtoToViewModel,
  mapServiceEndorsementDtosToViewModels 
} from './service-endorsement.mapper';

describe('ServiceEndorsement Mapper', () => {
  it('should map DTO to ViewModel', () => {
    const dto = {
      id: '1',
      enabled: true,
      title: 'Great',
      description: 'This is amazing!',
      by: 'John Doe',
      role: 'CEO'
    };

    const result = mapServiceEndorsementDtoToViewModel(dto);

    expect(result.quote).toBe('This is amazing!');
    expect(result.author).toBe('John Doe');
    expect(result.role).toBe('CEO');
  });

  it('should map array', () => {
    const dtos = [
      { id: '1', enabled: true, title: '', description: 'Quote 1', by: 'A', role: 'CEO' },
      { id: '2', enabled: true, title: '', description: 'Quote 2', by: 'B', role: 'CTO' }
    ];

    const result = mapServiceEndorsementDtosToViewModels(dtos);

    expect(result.length).toBe(2);
    expect(result[0].quote).toBe('Quote 1');
  });
});
