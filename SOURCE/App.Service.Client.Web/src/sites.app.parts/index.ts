/**
 * sites.app.parts - Platform Parts
 * 
 * System-level features served under /system/* URL prefix.
 * These support users but aren't the primary reason they came to the app.
 * 
 * Route Structure (after restructuring):
 * - /system/hub           → Central landing page
 * - /system/messages      → Internal messaging
 * - /system/trash         → Recycle bin
 * - /system/support       → Help/support tickets
 * - /system/settings      → User & account settings
 * - /system/billing       → User billing
 * - etc.
 * 
 * Routing: sites.app.parts/routing.module.ts
 * 
 * @see _custom/documentation/architecture/ROUTE-RESTRUCTURING.md
 */

// This folder contains platform parts loaded via sites.app.parts/routing.module.ts
// Each module is lazy-loaded directly from the routing.
