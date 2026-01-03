/**
 * Wiki Page Model
 * 
 * Represents a wiki page with metadata and content.
 * Based on the hybrid storage approach:
 * - Metadata stored in database
 * - Content stored in Azure Blob
 */
import { WikiPageStatus } from '../constants';

/**
 * Wiki page DTO (from API)
 */
export interface WikiPageDto {
  /** Unique page ID */
  id: string;
  
  /** Namespace (e.g., "public", "internal", "admin") */
  namespace: string;
  
  /** URL-friendly slug */
  slug: string;
  
  /** Page title */
  title: string;
  
  /** Blob path to markdown content */
  contentPath: string;
  
  // ─────────────────────────────────────────────────────────────
  // Hierarchy
  // ─────────────────────────────────────────────────────────────
  
  /** Parent page ID (for nested pages) */
  parentId?: string;
  
  /** Sort order within parent */
  order: number;
  
  // ─────────────────────────────────────────────────────────────
  // Permissions
  // ─────────────────────────────────────────────────────────────
  
  /** Roles required to read (empty = inherit from namespace) */
  readRoles: string[];
  
  /** Roles required to edit */
  editRoles: string[];
  
  // ─────────────────────────────────────────────────────────────
  // Metadata
  // ─────────────────────────────────────────────────────────────
  
  /** Author user ID */
  authorId: string;
  
  /** Author display name */
  authorName?: string;
  
  /** Created timestamp */
  createdUtc: string;
  
  /** Last updated timestamp */
  updatedUtc: string;
  
  /** Published timestamp */
  publishedUtc?: string;
  
  // ─────────────────────────────────────────────────────────────
  // Status
  // ─────────────────────────────────────────────────────────────
  
  /** Page status */
  status: WikiPageStatus;
  
  /** Version number */
  version: number;
  
  // ─────────────────────────────────────────────────────────────
  // SEO (for public pages)
  // ─────────────────────────────────────────────────────────────
  
  /** Meta description for SEO */
  metaDescription?: string;
  
  /** Meta keywords for SEO */
  metaKeywords?: string[];
  
  /** Tags for categorization */
  tags?: string[];
  
  /** Icon for display */
  icon?: string;
}

/**
 * Wiki page with content (full page load)
 */
export interface WikiPage extends WikiPageDto {
  /** Markdown content */
  content: string;
  
  /** Estimated reading time in minutes */
  readingTime?: number;
  
  /** Table of contents (generated from headings) */
  toc?: WikiTocEntry[];
}

/**
 * Wiki page metadata (lightweight, for lists)
 */
export interface WikiPageMeta {
  id: string;
  namespace: string;
  slug: string;
  title: string;
  parentId?: string;
  order: number;
  status: WikiPageStatus;
  updatedUtc: string;
  authorName?: string;
  icon?: string;
  tags?: string[];
}

/**
 * Table of contents entry
 */
export interface WikiTocEntry {
  /** Anchor ID */
  id: string;
  
  /** Heading text */
  title: string;
  
  /** Heading level (1-6) */
  level: number;
  
  /** Child entries */
  children?: WikiTocEntry[];
}

/**
 * Wiki page tree node (for sidebar navigation)
 */
export interface WikiPageTreeNode {
  /** Page metadata */
  page: WikiPageMeta;
  
  /** Child pages */
  children: WikiPageTreeNode[];
  
  /** Whether node is expanded in UI */
  expanded?: boolean;
}

/**
 * Wiki namespace with pages
 */
export interface WikiNamespace {
  /** Namespace ID */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Description */
  description?: string;
  
  /** Icon */
  icon?: string;
  
  /** Root-level pages in this namespace */
  pages: WikiPageMeta[];
  
  /** Total page count */
  pageCount: number;
}

/**
 * Wiki search result
 */
export interface WikiSearchResult {
  /** Page metadata */
  page: WikiPageMeta;
  
  /** Relevance score */
  score: number;
  
  /** Highlighted excerpt */
  excerpt?: string;
  
  /** Matched terms */
  matchedTerms?: string[];
}

/**
 * Wiki page version (for history)
 */
export interface WikiPageVersion {
  /** Version number */
  version: number;
  
  /** Timestamp */
  createdUtc: string;
  
  /** Author */
  authorName: string;
  
  /** Change summary */
  summary?: string;
  
  /** Content path for this version */
  contentPath: string;
}

/**
 * Create/Update wiki page request
 */
export interface WikiPageRequest {
  /** Namespace */
  namespace: string;
  
  /** Page slug */
  slug: string;
  
  /** Page title */
  title: string;
  
  /** Markdown content */
  content: string;
  
  /** Parent page ID */
  parentId?: string;
  
  /** Sort order */
  order?: number;
  
  /** Status */
  status?: WikiPageStatus;
  
  /** SEO description */
  metaDescription?: string;
  
  /** Tags */
  tags?: string[];
  
  /** Icon */
  icon?: string;
  
  /** Change summary (for versioning) */
  changeSummary?: string;
}
