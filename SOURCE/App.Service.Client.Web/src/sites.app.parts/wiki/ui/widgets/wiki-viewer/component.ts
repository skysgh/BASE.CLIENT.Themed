/**
 * Wiki Viewer Component
 * 
 * Reusable component for rendering wiki markdown content.
 * Supports syntax highlighting via Prism.js.
 */
import { Component, Input, OnChanges, SimpleChanges, signal, inject, AfterViewChecked, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Import Prism.js core and languages
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-markup';

@Component({
  selector: 'app-wiki-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wiki-viewer">
      <!-- Loading -->
      @if (loading) {
        <div class="text-center py-4">
          <div class="spinner-border spinner-border-sm text-primary"></div>
          <span class="ms-2 text-muted">Loading content...</span>
        </div>
      }

      <!-- Content -->
      @if (!loading && renderedHtml()) {
        <div class="wiki-content markdown-body" [innerHTML]="renderedHtml()"></div>
      }

      <!-- Empty state -->
      @if (!loading && !content) {
        <div class="text-center py-4 text-muted">
          <i class="bx bx-file-blank display-4"></i>
          <p class="mt-2">No content available</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .wiki-viewer {
      line-height: 1.6;
    }

    .markdown-body {
      font-size: 1rem;
    }

    .markdown-body :deep(h1) {
      font-size: 2rem;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--vz-border-color);
    }

    .markdown-body :deep(h2) {
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 2rem;
      margin-bottom: 1rem;
      padding-bottom: 0.3rem;
      border-bottom: 1px solid var(--vz-border-color);
    }

    .markdown-body :deep(h3) {
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }

    .markdown-body :deep(h4),
    .markdown-body :deep(h5),
    .markdown-body :deep(h6) {
      font-weight: 600;
      margin-top: 1.25rem;
      margin-bottom: 0.5rem;
    }

    .markdown-body :deep(p) {
      margin-bottom: 1rem;
    }

    .markdown-body :deep(ul),
    .markdown-body :deep(ol) {
      margin-bottom: 1rem;
      padding-left: 1.5rem;
    }

    .markdown-body :deep(li) {
      margin-bottom: 0.25rem;
    }

    .markdown-body :deep(code) {
      background: var(--vz-light);
      padding: 0.2em 0.4em;
      border-radius: 4px;
      font-size: 0.9em;
      font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
    }

    .markdown-body :deep(pre) {
      background: #2d2d2d;
      color: #ccc;
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
      margin-bottom: 1rem;
      line-height: 1.4;
    }

    .markdown-body :deep(pre code) {
      background: transparent;
      padding: 0;
      font-size: 0.85rem;
      line-height: 1.5;
      white-space: pre;
      display: block;
    }

    .markdown-body :deep(blockquote) {
      border-left: 4px solid var(--vz-primary);
      margin: 1rem 0;
      padding: 0.5rem 1rem;
      background: var(--vz-light);
      font-style: italic;
    }

    .markdown-body :deep(blockquote p:last-child) {
      margin-bottom: 0;
    }

    .markdown-body :deep(table) {
      width: 100%;
      margin-bottom: 1rem;
      border-collapse: collapse;
    }

    .markdown-body :deep(th),
    .markdown-body :deep(td) {
      padding: 0.5rem;
      border: 1px solid var(--vz-border-color);
    }

    .markdown-body :deep(th) {
      background: var(--vz-light);
      font-weight: 600;
    }

    .markdown-body :deep(a) {
      color: var(--vz-primary);
      text-decoration: none;
    }

    .markdown-body :deep(a:hover) {
      text-decoration: underline;
    }

    .markdown-body :deep(img) {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 1rem 0;
    }

    .markdown-body :deep(hr) {
      margin: 2rem 0;
      border: none;
      border-top: 1px solid var(--vz-border-color);
    }

    /* ════════════════════════════════════════════════════════
       Prism.js Tomorrow Night Theme (VS Code-like dark theme)
       ════════════════════════════════════════════════════════ */
    .markdown-body :deep(.token.comment),
    .markdown-body :deep(.token.block-comment),
    .markdown-body :deep(.token.prolog),
    .markdown-body :deep(.token.doctype),
    .markdown-body :deep(.token.cdata) {
      color: #999;
    }

    .markdown-body :deep(.token.punctuation) {
      color: #ccc;
    }

    .markdown-body :deep(.token.tag),
    .markdown-body :deep(.token.attr-name),
    .markdown-body :deep(.token.namespace),
    .markdown-body :deep(.token.deleted) {
      color: #e2777a;
    }

    .markdown-body :deep(.token.function-name) {
      color: #6196cc;
    }

    .markdown-body :deep(.token.boolean),
    .markdown-body :deep(.token.number),
    .markdown-body :deep(.token.function) {
      color: #f08d49;
    }

    .markdown-body :deep(.token.property),
    .markdown-body :deep(.token.class-name),
    .markdown-body :deep(.token.constant),
    .markdown-body :deep(.token.symbol) {
      color: #f8c555;
    }

    .markdown-body :deep(.token.selector),
    .markdown-body :deep(.token.important),
    .markdown-body :deep(.token.atrule),
    .markdown-body :deep(.token.keyword),
    .markdown-body :deep(.token.builtin) {
      color: #cc99cd;
    }

    .markdown-body :deep(.token.string),
    .markdown-body :deep(.token.char),
    .markdown-body :deep(.token.attr-value),
    .markdown-body :deep(.token.regex),
    .markdown-body :deep(.token.variable) {
      color: #7ec699;
    }

    .markdown-body :deep(.token.operator),
    .markdown-body :deep(.token.entity),
    .markdown-body :deep(.token.url) {
      color: #67cdcc;
    }

    .markdown-body :deep(.token.important),
    .markdown-body :deep(.token.bold) {
      font-weight: bold;
    }

    .markdown-body :deep(.token.italic) {
      font-style: italic;
    }

    .markdown-body :deep(.token.entity) {
      cursor: help;
    }

    .markdown-body :deep(.token.inserted) {
      color: green;
    }
  `]
})
export class WikiViewerComponent implements OnChanges, AfterViewChecked {
  private sanitizer = inject(DomSanitizer);
  private elementRef = inject(ElementRef);

  @Input() content: string = '';
  @Input() loading: boolean = false;
  @Input() enableSyntaxHighlight: boolean = true;

  renderedHtml = signal<SafeHtml | null>(null);
  private needsHighlight = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content']) {
      this.renderContent();
    }
  }

  ngAfterViewChecked(): void {
    if (this.needsHighlight && this.enableSyntaxHighlight) {
      this.highlightCode();
      this.needsHighlight = false;
    }
  }

  private renderContent(): void {
    if (!this.content) {
      this.renderedHtml.set(null);
      return;
    }

    const html = this.markdownToHtml(this.content);
    this.renderedHtml.set(this.sanitizer.bypassSecurityTrustHtml(html));
    this.needsHighlight = true;
  }

  /**
   * Convert markdown to HTML
   * Improved handling for code blocks to prevent double-spacing
   */
  private markdownToHtml(markdown: string): string {
    // Step 1: Extract code blocks FIRST and replace with unique placeholders
    // Using a marker that won't be affected by HTML escaping
    const codeBlocks: { lang: string; code: string }[] = [];
    const PLACEHOLDER_PREFIX = '___CODEBLOCK___';
    
    let processedMarkdown = markdown.replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      (_, lang, code) => {
        const index = codeBlocks.length;
        codeBlocks.push({ lang: lang || 'plaintext', code: code.trim() });
        return `\n${PLACEHOLDER_PREFIX}${index}${PLACEHOLDER_PREFIX}\n`;
      }
    );

    // Step 2: Escape HTML in remaining content (not code blocks)
    processedMarkdown = processedMarkdown
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Step 3: Process inline elements first (before block elements)
    processedMarkdown = processedMarkdown
      // Inline code (must escape HTML inside)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      
      // Bold
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      
      // Italic
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      
      // Images (must come before links)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Step 4: Process block elements
    processedMarkdown = processedMarkdown
      // Headers (with anchor IDs)
      .replace(/^######\s+(.+)$/gm, (_, text) => `<h6 id="${this.slugify(text)}">${text}</h6>`)
      .replace(/^#####\s+(.+)$/gm, (_, text) => `<h5 id="${this.slugify(text)}">${text}</h5>`)
      .replace(/^####\s+(.+)$/gm, (_, text) => `<h4 id="${this.slugify(text)}">${text}</h4>`)
      .replace(/^###\s+(.+)$/gm, (_, text) => `<h3 id="${this.slugify(text)}">${text}</h3>`)
      .replace(/^##\s+(.+)$/gm, (_, text) => `<h2 id="${this.slugify(text)}">${text}</h2>`)
      .replace(/^#\s+(.+)$/gm, (_, text) => `<h1 id="${this.slugify(text)}">${text}</h1>`)
      
      // Horizontal rules
      .replace(/^---$/gm, '<hr>')
      
      // Blockquotes (handle multi-line)
      .replace(/^&gt;\s+(.+)$/gm, '<blockquote><p>$1</p></blockquote>')
      .replace(/<\/blockquote>\n<blockquote>/g, '\n');

    // Step 5: Process tables
    processedMarkdown = this.processMarkdownTables(processedMarkdown);

    // Step 6: Process lists
    processedMarkdown = this.processMarkdownLists(processedMarkdown);

    // Step 7: Wrap remaining text in paragraphs
    const lines = processedMarkdown.split('\n');
    const processedLines: string[] = [];
    let paragraphContent: string[] = [];

    const flushParagraph = () => {
      if (paragraphContent.length > 0) {
        processedLines.push(`<p>${paragraphContent.join(' ')}</p>`);
        paragraphContent = [];
      }
    };

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines - flush paragraph
      if (!trimmedLine) {
        flushParagraph();
        continue;
      }

      // Check if line is a code block placeholder
      if (trimmedLine.startsWith(PLACEHOLDER_PREFIX)) {
        flushParagraph();
        processedLines.push(trimmedLine);
        continue;
      }

      // Check if line is already an HTML block element
      if (trimmedLine.startsWith('<h') ||
          trimmedLine.startsWith('<ul') ||
          trimmedLine.startsWith('<ol') ||
          trimmedLine.startsWith('<li') ||
          trimmedLine.startsWith('</ul') ||
          trimmedLine.startsWith('</ol') ||
          trimmedLine.startsWith('<blockquote') ||
          trimmedLine.startsWith('<table') ||
          trimmedLine.startsWith('<hr')) {
        flushParagraph();
        processedLines.push(trimmedLine);
      } else {
        // Regular text content - accumulate for paragraph
        paragraphContent.push(trimmedLine);
      }
    }

    // Close any remaining paragraph
    flushParagraph();

    let html = processedLines.join('\n');

    // Step 8: Restore code blocks with proper Prism classes
    codeBlocks.forEach((block, index) => {
      // Escape HTML entities in code
      const escapedCode = block.code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      
      const codeHtml = `<pre class="language-${block.lang}"><code class="language-${block.lang}">${escapedCode}</code></pre>`;
      const placeholder = `${PLACEHOLDER_PREFIX}${index}${PLACEHOLDER_PREFIX}`;
      
      // Replace placeholder (may or may not be wrapped in <p>)
      html = html.replace(`<p>${placeholder}</p>`, codeHtml);
      html = html.replace(placeholder, codeHtml);
    });

    // Clean up empty paragraphs
    html = html.replace(/<p>\s*<\/p>/g, '');

    return html;
  }

  /**
   * Process markdown tables
   */
  private processMarkdownTables(markdown: string): string {
    const tableRegex = /\|(.+)\|\n\|[-|:\s]+\|\n((?:\|.+\|\n?)+)/g;
    
    return markdown.replace(tableRegex, (match, headerRow, bodyRows) => {
      const headers = headerRow.split('|').filter((h: string) => h.trim());
      const headerHtml = headers
        .map((h: string) => `<th>${h.trim()}</th>`)
        .join('');

      const rows = bodyRows.trim().split('\n');
      const bodyHtml = rows
        .map((row: string) => {
          const cells = row.split('|').filter((c: string) => c.trim());
          const cellsHtml = cells
            .map((c: string) => `<td>${c.trim()}</td>`)
            .join('');
          return `<tr>${cellsHtml}</tr>`;
        })
        .join('\n');

      return `<table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`;
    });
  }

  /**
   * Process markdown lists (unordered and ordered)
   */
  private processMarkdownLists(markdown: string): string {
    // Process unordered lists
    markdown = markdown.replace(
      /((?:^[\-\*]\s+.+$\n?)+)/gm,
      (match) => {
        const items = match.trim().split('\n')
          .map(line => {
            const content = line.replace(/^[\-\*]\s+/, '');
            return `<li>${content}</li>`;
          })
          .join('\n');
        return `<ul>\n${items}\n</ul>`;
      }
    );

    // Process ordered lists
    markdown = markdown.replace(
      /((?:^\d+\.\s+.+$\n?)+)/gm,
      (match) => {
        const items = match.trim().split('\n')
          .map(line => {
            const content = line.replace(/^\d+\.\s+/, '');
            return `<li>${content}</li>`;
          })
          .join('\n');
        return `<ol>\n${items}\n</ol>`;
      }
    );

    return markdown;
  }

  /**
   * Apply Prism.js syntax highlighting to all code blocks
   */
  private highlightCode(): void {
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      const element = this.elementRef.nativeElement;
      const codeBlocks = element.querySelectorAll('pre code');
      
      codeBlocks.forEach((block: Element) => {
        Prism.highlightElement(block);
      });
    }, 0);
  }

  /**
   * Convert text to URL-safe slug
   */
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
