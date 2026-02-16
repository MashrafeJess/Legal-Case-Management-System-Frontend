import {
  Component, OnInit,
  ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder,
         FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PaymentMethodService } from '../../../core/services/payment-method.service';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-payment-method-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, Sidebar],
  providers: [DatePipe],
  templateUrl: './payment-method-list.html'
})
export class PaymentMethodList implements OnInit {
  methods:        any[] = [];
  loading               = true;
  errorMessage          = '';
  successMessage        = '';

  // ── Inline form ───────────────────────────────────────
  showForm    = false;
  formLoading = false;
  formError   = '';
  editingId:  number | null = null;
  methodForm!: FormGroup;

  constructor(
    private methodService: PaymentMethodService,
    private fb:            FormBuilder,
    private router:        Router,
    private cdr:           ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAll();

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.loadAll());
  }

  initForm(): void {
    this.methodForm = this.fb.group({
      paymentMethodName: ['', Validators.required],
      paymentStatus:     [true]
    });
  }

  loadAll(): void {
    this.loading      = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.methodService.getAll().subscribe({
      next: (res) => {
        if (res.success) this.methods = res.data;
        else this.errorMessage        = res.message;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load payment methods.';
        this.loading      = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ── Form controls ─────────────────────────────────────
  openForm(): void {
    this.editingId = null;
    this.formError = '';
    this.showForm  = true;
    this.methodForm.reset({ paymentStatus: true });
    this.cdr.detectChanges();
  }

  editMethod(m: any): void {
    this.editingId = m.paymentMethodId;
    this.formError = '';
    this.showForm  = true;
    this.methodForm.patchValue({
      paymentMethodName: m.paymentMethodName,
      paymentStatus:     m.paymentStatus
    });
    this.cdr.detectChanges();
  }

  cancelForm(): void {
    this.showForm  = false;
    this.editingId = null;
    this.formError = '';
    this.methodForm.reset({ paymentStatus: true });
    this.cdr.detectChanges();
  }

  isInvalid(field: string): boolean {
    const c = this.methodForm.get(field);
    return !!(c?.invalid && c?.touched);
  }

  onSubmit(): void {
    if (this.methodForm.invalid) {
      this.methodForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.formLoading    = true;
    this.formError      = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    const v = this.methodForm.value;

    const request = this.editingId
      ? this.methodService.update({
          paymentMethodId:   this.editingId,
          paymentMethodName: v.paymentMethodName,
          paymentStatus:     v.paymentStatus
        })
      : this.methodService.create({
          paymentMethodName: v.paymentMethodName
        });

    request.subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage = this.editingId
            ? 'Payment method updated!'
            : 'Payment method added!';
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

  deleteMethod(id: number): void {
    if (!confirm('Delete this payment method?')) return;
    this.methodService.delete(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage = 'Payment method deleted!';
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
