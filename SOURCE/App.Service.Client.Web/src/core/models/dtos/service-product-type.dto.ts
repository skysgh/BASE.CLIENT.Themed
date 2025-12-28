/**
 * Service Product Type Data Transfer Object
 * 
 * Represents a category/type of product.
 * Maps to: base_service_ProductTypes table in JSON-server
 * 
 * Parent entity for Products.
 * Examples: "Type A", "Type B"
 */
export interface ServiceProductTypeDto {
  id: string;
  title: string;
  description: string;
}
