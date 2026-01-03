/**
 * Wiki Editor Component
 * 
 * Full-featured markdown editor for wiki pages.
 * Supports live preview and basic toolbar actions.
 */
import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { WikiService } from '../../../services/wiki.service';
import { WikiViewerComponent } from '../../widgets/wiki-viewer/component';
import { WikiPage, WikiPageRequest } from '../../../models';

@Component({
  selector: 'app-wiki-editor',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, WikiViewerComponent],
  template: `
    <div class="wiki-editor">
      <!-- Header -->
      <div class="editor-header d-flex justify-content-between align-items-center mb-3">
        <div>
          <a [routerLink]="getBackLink()" class="btn btn-outline-secondary btn-sm me-2">
            <i class="bx bx-arrow-back me-1"></i>
            Cancel
          </a>
          <span class="text-muted">
            {{ isNewPage() ? 'New Page' : 'Edit Page' }}
          </span>
        </div>
        <div class="d-flex gap-2">
          <button 
            type="button" 
            class="btn btn-outline-secondary btn-sm"
            (click)="togglePreview()">
            <i class="bx {{ showPreview() ? 'bx-edit' : 'bx-show' }} me-1"></i>
            {{ showPreview() ? 'Edit' : 'Preview' }}
          </button>
          <button 
            type="button" 
            class="btn btn-primary btn-sm"
            [disabled]="wikiService.saving() || !pageForm.valid"
            (click)="savePage()">
            @if (wikiService.saving()) {
              <span class="spinner-border spinner-border-sm me-1"></span>
            } @else {
              <i class="bx bx-save me-1"></i>
            }
            Save
          </button>
        </div>
      </div>

      <!-- Error Alert -->
      @if (wikiService.error()) {
        <div class="alert alert-danger alert-dismissible mb-3">
          <i class="bx bx-error-circle me-1"></i>
          {{ wikiService.error() }}
          <button type="button" class="btn-close" (click)="clearError()"></button>
        </div>
      }

      <!-- Editor Form -->
      <form [formGroup]="pageForm" class="editor-form">
        <!-- Page Metadata -->
        <div class="card mb-3">
          <div class="card-header bg-transparent">
            <i class="bx bx-info-circle me-2"></i>
            Page Information
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Title <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control"
                  formControlName="title"
                  placeholder="Page title"
                  (input)="onTitleChange()">
                @if (pageForm.get('title')?.invalid && pageForm.get('title')?.touched) {
                  <div class="text-danger small mt-1">Title is required</div>
                }
              </div>
              <div class="col-md-3 mb-3">
                <label class="form-label">Namespace <span class="text-danger">*</span></label>
                <select class="form-select" formControlName="namespace">
                  @for (ns of wikiService.availableNamespaces(); track ns.id) {
                    @if (wikiService.canEditNamespace(ns.id)) {
                      <option [value]="ns.id">{{ ns.name }}</option>
                    }
                  }
                </select>
              </div>
              <div class="col-md-3 mb-3">
                <label class="form-label">Slug <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control"
                  formControlName="slug"
                  placeholder="page-slug">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Description</label>
                <input 
                  type="text" 
                  class="form-control"
                  formControlName="metaDescription"
                  placeholder="Brief description for SEO">
              </div>
              <div class="col-md-3 mb-3">
                <label class="form-label">Icon</label>
                <input 
                  type="text" 
                  class="form-control"
                  formControlName="icon"
                  placeholder="bx-file">
              </div>
              <div class="col-md-3 mb-3">
                <label class="form-label">Tags</label>
                <input 
                  type="text" 
                  class="form-control"
                  formControlName="tagsInput"
                  placeholder="tag1, tag2, tag3">
              </div>
            </div>
          </div>
        </div>

        <!-- Content Editor / Preview -->
        <div class="card">
          <div class="card-header bg-transparent d-flex justify-content-between align-items-center">
            <span>
              <i class="bx {{ showPreview() ? 'bx-show' : 'bx-code-alt' }} me-2"></i>
              {{ showPreview() ? 'Preview' : 'Content' }}
            </span>
            @if (!showPreview()) {
              <div class="editor-toolbar d-flex gap-1">
                <button type="button" class="btn btn-sm btn-light" title="Bold" (click)="insertFormat('**', '**')">
                  <i class="bx bx-bold"></i>
                </button>
                <button type="button" class="btn btn-sm btn-light" title="Italic" (click)="insertFormat('*', '*')">
                  <i class="bx bx-italic"></i>
                </button>
                <button type="button" class="btn btn-sm btn-light" title="Code" (click)="insertInlineCode()">
                  <i class="bx bx-code"></i>
                </button>
                <span class="border-end mx-1"></span>
                <button type="button" class="btn btn-sm btn-light" title="Heading" (click)="insertLine('## ')">
                  <i class="bx bx-heading"></i>
                </button>
                <button type="button" class="btn btn-sm btn-light" title="List" (click)="insertLine('- ')">
                  <i class="bx bx-list-ul"></i>
                </button>
                <button type="button" class="btn btn-sm btn-light" title="Quote" (click)="insertLine('> ')">
                  <i class="bx bx-quote-left"></i>
                </button>
                <span class="border-end mx-1"></span>
                <button type="button" class="btn btn-sm btn-light" title="Link" (click)="insertLink()">
                  <i class="bx bx-link"></i>
                </button>
                <button type="button" class="btn btn-sm btn-light" title="Image" (click)="insertImage()">
                  <i class="bx bx-image"></i>
                </button>
                <button type="button" class="btn btn-sm btn-light" title="Code Block" (click)="insertCodeBlock()">
                  <i class="bx bx-code-block"></i>
                </button>
              </div>
            }
          </div>
          <div class="card-body p-0">
            @if (showPreview()) {
              <div class="preview-container p-4">
                <app-wiki-viewer 
                  [content]="pageForm.get('content')?.value || ''"
                  [enableSyntaxHighlight]="true">
                </app-wiki-viewer>
              </div>
            } @else {
              <textarea
                #contentEditor
                class="form-control content-editor"
                formControlName="content"
                placeholder="Write your content in Markdown..."
                rows="20">
              </textarea>
            }
          </div>
        </div>

        <!-- Change Summary -->
        @if (!isNewPage()) {
          <div class="mt-3">
            <label class="form-label">Change Summary</label>
            <input 
              type="text" 
              class="form-control"
              formControlName="changeSummary"
              placeholder="Briefly describe your changes">
          </div>
        }
      </form>
    </div>
  `,
  styles: [`
    .wiki-editor {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .content-editor {
      font-family: 'Fira Code', 'Consolas', monospace;
      font-size: 14px;
      line-height: 1.6;
      border: none;
      border-radius: 0;
      resize: vertical;
      min-height: 400px;
    }

    .content-editor:focus {
      box-shadow: none;
      border: none;
    }

    .preview-container {
      min-height: 400px;
      background: var(--vz-light);
    }

    .editor-toolbar .btn {
      padding: 0.25rem 0.5rem;
    }
  `]
})
export class WikiEditorComponent implements OnInit, OnDestroy {
  wikiService = inject(WikiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  pageForm: FormGroup;
  showPreview = signal(false);

  private existingPage: WikiPage | null = null;
  private namespace = '';
  private slug = '';

  constructor() {
    this.pageForm = this.fb.group({
      title: ['', Validators.required],
      namespace: ['public', Validators.required],
      slug: ['', Validators.required],
      content: [''],
      metaDescription: [''],
      icon: [''],
      tagsInput: [''],
      changeSummary: [''],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.namespace = params.get('namespace') || 'public';
      this.slug = params.get('slug') || '';

      this.pageForm.patchValue({ namespace: this.namespace });

      if (this.slug) {
        this.loadExistingPage();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isNewPage(): boolean {
    return !this.existingPage;
  }

  getBackLink(): string[] {
    if (this.existingPage) {
      return ['..', '..', this.namespace, this.slug];
    }
    return ['..', '..'];
  }

  togglePreview(): void {
    this.showPreview.update(v => !v);
  }

  clearError(): void {
    // WikiService handles errors internally
  }

  onTitleChange(): void {
    // Auto-generate slug from title if creating new page
    if (this.isNewPage()) {
      const title = this.pageForm.get('title')?.value || '';
      const slug = this.slugify(title);
      this.pageForm.patchValue({ slug });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Toolbar Actions
  // ─────────────────────────────────────────────────────────────

  insertFormat(before: string, after: string): void {
    const content = this.pageForm.get('content')?.value || '';
    const textarea = document.querySelector('.content-editor') as HTMLTextAreaElement;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = content.substring(start, end);
      
      const newContent = content.substring(0, start) + before + selected + after + content.substring(end);
      this.pageForm.patchValue({ content: newContent });
      
      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, end + before.length);
      }, 0);
    }
  }

  insertInlineCode(): void {
    this.insertFormat('`', '`');
  }

  insertLine(prefix: string): void {
    const content = this.pageForm.get('content')?.value || '';
    const textarea = document.querySelector('.content-editor') as HTMLTextAreaElement;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const lineStart = content.lastIndexOf('\n', start - 1) + 1;
      
      const newContent = content.substring(0, lineStart) + prefix + content.substring(lineStart);
      this.pageForm.patchValue({ content: newContent });
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, start + prefix.length);
      }, 0);
    }
  }

  insertLink(): void {
    const url = prompt('Enter URL:');
    if (url) {
      const text = prompt('Enter link text:', 'Link') || 'Link';
      this.insertFormat(`[${text}](`, ')');
      
      const content = this.pageForm.get('content')?.value || '';
      const textarea = document.querySelector('.content-editor') as HTMLTextAreaElement;
      if (textarea) {
        const pos = textarea.selectionStart;
        const newContent = content.substring(0, pos) + url + content.substring(pos);
        this.pageForm.patchValue({ content: newContent });
      }
    }
  }

  insertImage(): void {
    const url = prompt('Enter image URL:');
    if (url) {
      const alt = prompt('Enter alt text:', 'Image') || 'Image';
      const content = this.pageForm.get('content')?.value || '';
      const textarea = document.querySelector('.content-editor') as HTMLTextAreaElement;
      
      if (textarea) {
        const pos = textarea.selectionStart;
        const imageMarkdown = `![${alt}](${url})`;
        const newContent = content.substring(0, pos) + imageMarkdown + content.substring(pos);
        this.pageForm.patchValue({ content: newContent });
      }
    }
  }

  insertCodeBlock(): void {
    const lang = prompt('Enter language (e.g., typescript, javascript, html):', 'typescript') || '';
    const content = this.pageForm.get('content')?.value || '';
    const textarea = document.querySelector('.content-editor') as HTMLTextAreaElement;
    
    if (textarea) {
      const pos = textarea.selectionStart;
      const codeBlock = `\n\`\`\`${lang}\n\n\`\`\`\n`;
      const newContent = content.substring(0, pos) + codeBlock + content.substring(pos);
      this.pageForm.patchValue({ content: newContent });
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(pos + lang.length + 5, pos + lang.length + 5);
      }, 0);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Save / Load
  // ─────────────────────────────────────────────────────────────

  private loadExistingPage(): void {
    this.wikiService.loadPage(this.namespace, this.slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe(page => {
        if (page) {
          this.existingPage = page;
          this.pageForm.patchValue({
            title: page.title,
            namespace: page.namespace,
            slug: page.slug,
            content: page.content,
            metaDescription: page.metaDescription || '',
            icon: page.icon || '',
            tagsInput: page.tags?.join(', ') || '',
          });
        }
      });
  }

  savePage(): void {
    if (!this.pageForm.valid) return;

    const formValue = this.pageForm.value;
    const request: WikiPageRequest = {
      namespace: formValue.namespace,
      slug: formValue.slug,
      title: formValue.title,
      content: formValue.content,
      metaDescription: formValue.metaDescription || undefined,
      icon: formValue.icon || undefined,
      tags: formValue.tagsInput 
        ? formValue.tagsInput.split(',').map((t: string) => t.trim()).filter(Boolean)
        : undefined,
      changeSummary: formValue.changeSummary || undefined,
    };

    const save$ = this.existingPage
      ? this.wikiService.updatePage(this.existingPage.id, request)
      : this.wikiService.createPage(request);

    save$.pipe(takeUntil(this.destroy$)).subscribe(page => {
      if (page) {
        // Navigate to the saved page
        this.router.navigate(['..', '..', page.namespace, page.slug], { relativeTo: this.route });
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // Utilities
  // ─────────────────────────────────────────────────────────────

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
