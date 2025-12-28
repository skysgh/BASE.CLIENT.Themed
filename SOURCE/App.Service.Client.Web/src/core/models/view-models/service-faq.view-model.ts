/**
 * ServiceFaq ViewModel
 * 
 * UI-optimized representation of FAQ data.
 * Simplified structure for component consumption.
 * 
 * Pattern: DTO → Mapper → ViewModel → Component
 */
export interface ServiceFaqViewModel {
  /** Unique identifier */
  id: string;
  
  /** Question text (for display) */
  question: string;
  
  /** Answer text (for display) */
  answer: string;
  
  /** Category identifier */
  categoryId: string;
  
  /** Whether this FAQ is currently visible */
  enabled: boolean;
}
