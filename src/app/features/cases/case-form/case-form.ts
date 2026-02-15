import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseService } from '../../../core/services/case.service';
import { CaseTypeService } from '../../../core/services/case-type.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-case-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, Sidebar],
  templateUrl: './case-form.html'
})
export class CaseForm implements OnInit {
  caseForm!:     FormGroup;
  loading        = false;
  errorMessage   = '';
  successMessage = '';
  isEditMode     = false;
  caseId!:       number;
  selectedFiles: File[] = [];
  caseTypes:     any[]  = [];
  lawyers:       any[]  = [];

  constructor(
    private fb:              FormBuilder,
    private caseService:     CaseService,
    private caseTypeService: CaseTypeService,
    private userService:     UserService,
    private authService:     AuthService,
    private route:           ActivatedRoute,
    private router:          Router,
    private cdr:             ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.caseForm = this.fb.group({
      caseName:       ['', Validators.required],
      email:          ['', [Validators.required, Validators.email]],
      caseType:       ['', Validators.required],
      fee:            ['', Validators.required],
      caseHandlingBy: ['', Validators.required]
    });

    this.loadCaseTypes();
    this.loadLawyers();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.caseId     = +id;
      this.loadCase();
    }
  }

  loadCaseTypes(): void {
    this.caseTypeService.getAll().subscribe({
      next: (res) => {
        if (res.success) {
          this.caseTypes = res.data;
          this.cdr.detectChanges();
        }
      },
      error: () => {}
    });
  }

  loadLawyers(): void {
    this.userService.getLawyers().subscribe({
      next: (res) => {
        if (res.success) {
          this.lawyers = res.data;
          this.cdr.detectChanges();
        }
      },
      error: () => {}
    });
  }

  loadCase(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.caseService.getById(this.caseId).subscribe({
      next: (res) => {
        if (res.success) {
          const c = res.data;
          this.caseForm.patchValue({
            caseName:       c.caseName,
            email:          c.email,
            caseType:       c.caseType,
            fee:            c.fee,
            caseHandlingBy: c.caseHandlingBy
          });
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load case.';
        this.loading      = false;
        this.cdr.detectChanges();
      }
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
      this.cdr.detectChanges();
    }
  }

  formatSize(bytes: number): string {
    if (bytes < 1024)        return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  isInvalid(field: string): boolean {
    const c = this.caseForm.get(field);
    return !!(c?.invalid && c?.touched);
  }

  onSubmit(): void {
    if (this.caseForm.invalid) {
      this.caseForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.loading      = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    const fd = new FormData();
    fd.append('caseName',       this.caseForm.value.caseName);
    fd.append('email',          this.caseForm.value.email);
    fd.append('caseType',       this.caseForm.value.caseType);
    fd.append('fee',            this.caseForm.value.fee);
    fd.append('caseHandlingBy', this.caseForm.value.caseHandlingBy);

    if (this.isEditMode) {
      fd.append('caseId', this.caseId.toString());
    }

    this.selectedFiles.forEach(file => {
      fd.append('formFiles', file, file.name);
    });

    const request = this.isEditMode
      ? this.caseService.update(fd)
      : this.caseService.create(fd);

    request.subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage = `Case ${this.isEditMode ? 'updated' : 'created'} successfully!`;
          this.cdr.detectChanges();
          setTimeout(() => this.router.navigate(['/cases']), 1500);
        } else {
          this.errorMessage = res.message || 'Operation failed.';
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Unable to connect.';
        this.loading      = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void { this.router.navigate(['/cases']); }
}

