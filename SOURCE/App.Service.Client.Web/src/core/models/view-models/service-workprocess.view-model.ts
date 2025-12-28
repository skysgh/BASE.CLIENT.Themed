/**
 * Service Workprocess View Model
 * 
 * UI-friendly representation of a service work process step.
 * Enhanced with display-specific properties for component rendering.
 */
export interface ServiceWorkprocessViewModel {
  id: string;
  serviceId: string;
  enabled: boolean;
  imageId: string;
  title: string;
  description: string;
  displayLabel: string;
  stepNumber?: number;
}
