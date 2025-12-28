/**
 * Service Delivery Team Member View Model
 * 
 * UI-friendly representation of a team member.
 * Enhanced with display-specific properties for component rendering.
 */
export interface ServiceDeliveryTeamMemberViewModel {
  id: string;
  enabled: boolean;
  name: string;
  description: string;
  role: string;
  imageName: string;
  displayLabel: string;
  imageUrl?: string;
}
