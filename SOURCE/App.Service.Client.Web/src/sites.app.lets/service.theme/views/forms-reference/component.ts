import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

/**
 * Forms Reference Component
 */
@Component({
  selector: 'app-forms-reference',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="forms-reference">
      <div class="d-flex align-items-center mb-4">
        <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3">
          <i class="bx bx-arrow-back"></i>
        </a>
        <h3 class="mb-0">
          <i class="bx bx-edit me-2 text-warning"></i>
          Forms Reference
        </h3>
      </div>

      <!-- Text Inputs -->
      <div class="card mb-4">
        <div class="card-header">Text Inputs</div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">Default Input</label>
            <input type="text" class="form-control" placeholder="Enter text...">
          </div>
          <div class="mb-3">
            <label class="form-label">With Icon</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bx bx-user"></i></span>
              <input type="text" class="form-control" placeholder="Username">
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Textarea</label>
            <textarea class="form-control" rows="3" placeholder="Description..."></textarea>
          </div>
        </div>
      </div>

      <!-- Select -->
      <div class="card mb-4">
        <div class="card-header">Select</div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">Default Select</label>
            <select class="form-select">
              <option value="">Choose...</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Checkboxes & Radios -->
      <div class="card mb-4">
        <div class="card-header">Checkboxes & Radios</div>
        <div class="card-body">
          <div class="form-check mb-2">
            <input class="form-check-input" type="checkbox" id="check1">
            <label class="form-check-label" for="check1">Checkbox</label>
          </div>
          <div class="form-check mb-2">
            <input class="form-check-input" type="radio" name="radio" id="radio1">
            <label class="form-check-label" for="radio1">Radio Option 1</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="radio" id="radio2">
            <label class="form-check-label" for="radio2">Radio Option 2</label>
          </div>
        </div>
      </div>

      <!-- Validation States -->
      <div class="card mb-4">
        <div class="card-header">Validation States</div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">Valid Input</label>
            <input type="text" class="form-control is-valid" value="Correct!">
            <div class="valid-feedback">Looks good!</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Invalid Input</label>
            <input type="text" class="form-control is-invalid">
            <div class="invalid-feedback">This field is required.</div>
          </div>
        </div>
      </div>

      <!-- Form Renderer Usage -->
      <div class="card">
        <div class="card-header">Using Form Renderer</div>
        <div class="card-body">
          <pre class="mb-0"><code>&lt;!-- Instead of raw Formly, use our wrapper: --&gt;
&lt;app-form-renderer
  [formDefinition]="formDef"
  [model]="data"
  [mode]="'edit'"
  (formSubmit)="onSave($event)"
  (formCancel)="onCancel()"&gt;
&lt;/app-form-renderer&gt;

&lt;!-- Benefits: --&gt;
&lt;!-- - No direct Formly dependency --&gt;
&lt;!-- - Consistent styling --&gt;
&lt;!-- - Can swap form engine later --&gt;</code></pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .forms-reference {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class FormsReferenceComponent {}
