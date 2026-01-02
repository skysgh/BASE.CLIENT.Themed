/**
 * FAQ Category ViewModel
 * 
 * UI-ready model with computed/display properties.
 */
export interface FaqCategoryViewModel {
  // Identity
  id: string;
  
  // Content
  title: string;
  description: string;
  
  // Display
  icon: string;
  iconClass: string;
  
  // Ordering
  order: number;
  
  // State
  enabled: boolean;
  
  // Culture
  cultureCode: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  
  // Computed
  /** Number of FAQ items in this category (set by service) */
  itemCount: number;
  
  /** Display label for lists */
  displayLabel: string;
}
