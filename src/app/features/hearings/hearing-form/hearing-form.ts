import {
  Component, OnInit,
  ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HearingService } from '../../../core/services/hearing.service';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-hearing-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, Sidebar],
  templateUrl: './hearing-form.html'
})
export class HearingForm implements OnInit {
  hearingForm!:  FormGroup;
  loading        = false;
  errorMessage   = '';
  successMessage = '';
  isEditMode     = false;
  hearingId!:    number;
  caseId!:       number;

  constructor(
    private fb:             FormBuilder,
    private hearingService: HearingService,
    private route:          ActivatedRoute,
    private router:         Router,
    private cdr:            ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // caseId comes from query params always
    this.caseId = +this.route.snapshot.queryParams['caseId'];

    this.hearingForm = this.fb.group({
      hearingDate: ['', Validators.required],
      isGoing:     [true]
    });

    // Edit mode — hearingId in route params
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.hearingId  = +id;
      this.loadHearing();
    }
  }

  loadHearing(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.hearingService.getById(this.hearingId).subscribe({
      next: (res) => {
        if (res.success) {
          const h = res.data;
          // Convert ISO date to datetime-local format
          const localDate = new Date(h.hearingDate)
            .toISOString().slice(0, 16);

          this.hearingForm.patchValue({
            hearingDate: localDate,
            isGoing:     h.isGoing
          });
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load hearing.';
        this.loading      = false;
        this.cdr.detectChanges();
      }
    });
  }

  isInvalid(field: string): boolean {
    const c = this.hearingForm.get(field);
    return !!(c?.invalid && c?.touched);
  }

  onSubmit(): void {
    if (this.hearingForm.invalid) {
      this.hearingForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.loading      = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    const v = this.hearingForm.value;

    // Convert datetime-local to ISO string
    const hearingDate = new Date(v.hearingDate).toISOString();

    if (this.isEditMode) {
      const payload = {
        hearingID:   this.hearingId,
        caseId:      this.caseId,
        hearingDate: hearingDate,
        isGoing:     v.isGoing,
        isPaid:      false
      };

      this.hearingService.update(payload).subscribe({
        next: (res) => {
          if (res.success) {
            this.successMessage = 'Hearing updated successfully!';
            this.cdr.detectChanges();
            setTimeout(() =>
              this.router.navigate(['/cases', this.caseId]), 1500);
          } else {
            this.errorMessage = res.message || 'Update failed.';
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

    } else {
      const payload = {
        caseId:      this.caseId,
        hearingDate: hearingDate,
        isGoing:     v.isGoing,
        isPaid:      false
      };

      this.hearingService.create(payload).subscribe({
        next: (res) => {
          if (res.success) {
            this.successMessage = 'Hearing added successfully!';
            this.cdr.detectChanges();
            setTimeout(() =>
              this.router.navigate(['/cases', this.caseId]), 1500);
          } else {
            this.errorMessage = res.message || 'Create failed.';
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
  }

  goBack(): void {
    this.router.navigate(['/cases', this.caseId]);
  }
}
