/**
 * System User Data Transfer Object
 * 
 * Represents a system user account.
 * Maps to: base_system_Users table in JSON-server
 * 
 * Examples: "Mr.Jones - The Janitor", "Mr.Smith - Principal"
 */
export interface SystemUserDto {
  id: string;
  title: string;
  description: string;
  identityFK: string;
}
