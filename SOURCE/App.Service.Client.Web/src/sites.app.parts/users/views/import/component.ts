import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-import',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="users-import">
      <div class="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <a routerLink="../" class="btn btn-outline-secondary btn-sm me-3"><i class="bx bx-arrow-back"></i></a>
          <h4 class="d-inline-block mb-0"><i class="bx bx-import me-2 text-success"></i>Import Users</h4>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="text-center py-5">
            <i class="bx bx-cloud-upload fs-1 text-muted mb-3"></i>
            <h5>Upload CSV or Excel File</h5>
            <p class="text-muted mb-4">Drag and drop your file here, or click to browse</p>
            <input type="file" class="form-control mx-auto" style="max-width: 400px;" accept=".csv,.xlsx,.xls">
          </div>
          
          <hr>
          
          <div class="row">
            <div class="col-md-6">
              <h6>Required Columns</h6>
              <ul class="text-muted small">
                <li>email (required)</li>
                <li>firstName</li>
                <li>lastName</li>
              </ul>
            </div>
            <div class="col-md-6">
              <h6>Optional Columns</h6>
              <ul class="text-muted small">
                <li>phone</li>
                <li>role</li>
                <li>status</li>
              </ul>
            </div>
          </div>
          
          <div class="d-flex justify-content-end gap-2 mt-4">
            <a href="#" class="btn btn-outline-primary"><i class="bx bx-download me-1"></i>Download Template</a>
            <button class="btn btn-primary" disabled><i class="bx bx-upload me-1"></i>Import</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`.users-import { padding: 1.5rem; }`]
})
export class UsersImportComponent {}
