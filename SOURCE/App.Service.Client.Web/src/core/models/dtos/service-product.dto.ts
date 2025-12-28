/**
 * Service Product Data Transfer Object
 * 
 * Represents a product/merchandise item for sale.
 * Maps to: base_service_Products table in JSON-server
 * 
 * Examples: "Clown T-Shirt", "Red Beach Ball"
 */
export interface ServiceProductDto {
  id: string;
  title: string;
  description: string;
  price: string;
  currency: string;
}
