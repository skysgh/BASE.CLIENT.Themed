/**
 * Service Workprocess Data Transfer Object
 * 
 * Represents a step in the service's work process/workflow.
 * Maps to: base_service_Workprocess table in JSON-server
 * 
 * Describes the steps customers go through when using the service.
 * Examples: "Tell us what you need", "Get free quotes", "Deliver high quality product"
 */
export interface ServiceWorkprocessDto {
  id: string;
  serviceId: string;
  enabled: boolean;
  imageId: string;
  title: string;
  description: string;
}
