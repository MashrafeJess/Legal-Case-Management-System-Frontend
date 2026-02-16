import {
  Component, OnInit,
  ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder,
         FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CaseTypeService } from '../../../core/services/case-type.service';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-case-type-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, Sidebar],
  providers: [DatePipe],
  templateUrl: './case-type-list.html'
})
export class CaseTypeList implements OnInit {
  caseTypes:      any[] = [];
  loading               = true;
  errorMessage          = '';
  successMessage        = '';

  // ── Inline form ──────────────────────────────────────
  showForm    = false;
  formLoading = false;
  formError   = '';
  editingId:  number | null = null;
  caseTypeForm!: FormGroup;

  constructor(
    private caseTypeService: CaseTypeService,
    private fb:              FormBuilder,
    private router:          Router,
    private cdr:             ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAll();

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.loadAll());
  }

  initForm(): void {
    this.caseTypeForm = this.fb.group({
      caseTypeName:        ['', Validators.required],
      caseTypeDescription: ['']
    });
  }

  loadAll(): void {
    this.loading      = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.caseTypeService.getAll().subscribe({
      next: (res) => {
        if (res.success) this.caseTypes = res.data;
        else this.errorMessage          = res.message;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load case types.';
        this.loading      = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ── Form controls ─────────────────────────────────────
  openForm(): void {
    this.editingId  = null;
    this.formError  = '';
    this.showForm   = true;
    this.caseTypeForm.reset();
    this.cdr.detectChanges();
  }

  editType(t: any): void {
    this.editingId  = t.caseTypeId;
    this.formError  = '';
    this.showForm   = true;
    this.caseTypeForm.patchValue({
      caseTypeName:        t.caseTypeName,
      caseTypeDescription: t.caseTypeDescription
    });
    this.cdr.detectChanges();
  }

  cancelForm(): void {
    this.showForm  = false;
    this.editingId = null;
    this.formError = '';
    this.caseTypeForm.reset();
    this.cdr.detectChanges();
  }

  isInvalid(field: string): boolean {
    const c = this.caseTypeForm.get(field);
    return !!(c?.invalid && c?.touched);
  }

  onSubmit(): void {
    if (this.caseTypeForm.invalid) {
      this.caseTypeForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.formLoading  = true;
    this.formError    = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    const v = this.caseTypeForm.value;

    const request = this.editingId
      ? this.caseTypeService.update({
          caseTypeId:          this.editingId,
          caseTypeName:        v.caseTypeName,
          caseTypeDescription: v.caseTypeDescription
        })
      : this.caseTypeService.create({
          caseTypeName:        v.caseTypeName,
          caseTypeDescription: v.caseTypeDescription
        });

    request.subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage = this.editingId
            ? 'Case type updated!'
            : 'Case type added!';
          this.cancelForm();
          this.loadAll();
        } else {
          this.formError = res.message || 'Operation failed.';
        }
        this.formLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.formError   = err.error?.message || 'Unable to connect.';
        this.formLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteType(id: number): void {
    if (!confirm('Delete this case type?')) return;
    this.caseTypeService.delete(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage = 'Case type deleted!';
          this.loadAll();
        } else {
          this.errorMessage = res.message;
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.errorMessage = 'Failed to delete.';
        this.cdr.detectChanges();
      }
    });
  }
}
