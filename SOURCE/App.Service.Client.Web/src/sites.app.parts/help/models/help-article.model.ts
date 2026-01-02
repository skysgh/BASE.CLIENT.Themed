/**
 * Help Article Model
 * 
 * Represents a help article with markdown content.
 * Articles are stored as YAML files with frontmatter + markdown body.
 */

/**
 * Article frontmatter (YAML header)
 */
export interface HelpArticleMeta {
  /** Unique article ID (slug) */
  id: string;
  
  /** Article title */
  title: string;
  
  /** Brief description/summary */
  description?: string;
  
  /** Category slug */
  category: string;
  
  /** Tags for search */
  tags?: string[];
  
  /** Sort order within category */
  order?: number;
  
  /** Culture code (e.g., 'en', 'fr') */
  culture: string;
  
  /** Last updated date */
  updatedAt?: string;
  
  /** Author name */
  author?: string;
  
  /** Related article IDs */
  relatedArticles?: string[];
  
  /** Icon for display */
  icon?: string;
  
  /** Whether article is published */
  published?: boolean;
}

/**
 * Full help article with content
 */
export interface HelpArticle extends HelpArticleMeta {
  /** Markdown content body */
  content: string;
  
  /** Estimated reading time (minutes) */
  readingTime?: number;
}

/**
 * Article category
 */
export interface HelpCategory {
  /** Category slug */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Description */
  description?: string;
  
  /** Icon */
  icon?: string;
  
  /** Sort order */
  order?: number;
  
  /** Article count */
  articleCount?: number;
}

/**
 * Help search result
 */
export interface HelpSearchResult {
  /** Article metadata */
  article: HelpArticleMeta;
  
  /** Relevance score */
  score: number;
  
  /** Highlighted excerpt */
  excerpt?: string;
}

/**
 * Help table of contents entry
 */
export interface HelpTocEntry {
  /** Section ID (for anchor) */
  id: string;
  
  /** Section title */
  title: string;
  
  /** Heading level (1-6) */
  level: number;
  
  /** Child entries */
  children?: HelpTocEntry[];
}
