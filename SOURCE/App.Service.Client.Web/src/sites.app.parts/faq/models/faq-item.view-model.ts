/**
 * FAQ Item ViewModel
 * 
 * UI-ready model with computed/display properties.
 */
export interface FaqItemViewModel {
  // Identity
  id: string;
  
  // Parent
  categoryId: string;
  categoryTitle?: string;
  
  // Content
  question: string;
  answer: string;
  
  // Ordering
  order: number;
  
  // State
  enabled: boolean;
  
  // Culture
  cultureCode: string;
  
  // Tags
  tags: string[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  
  // Computed
  /** Truncated answer for previews */
  answerPreview: string;
  
  /** Display label for lists */
  displayLabel: string;
}
