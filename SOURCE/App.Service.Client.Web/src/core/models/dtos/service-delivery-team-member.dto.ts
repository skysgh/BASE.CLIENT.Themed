/**
 * Service Delivery Team Member Data Transfer Object
 * 
 * Represents a member of the service delivery team.
 * Maps to: base_service_DeliveryTeamMembers table in JSON-server
 * 
 * Used to showcase the team behind the service on landing pages.
 * Examples: "Mark Rumble - Fearless Leader", "Russell Brand - Project Manager"
 */
export interface ServiceDeliveryTeamMemberDto {
  id: string;
  enabled: boolean;
  title: string;
  description: string;
  role: string;
  imageName: string;
}
