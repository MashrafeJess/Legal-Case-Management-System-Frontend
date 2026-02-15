import {
  Component, OnInit,
  ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../core/services/payment.service';
import { PaymentMethodService } from '../../../core/services/payment-method.service';
import { AuthService } from '../../../core/services/auth.service';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-payment-initiate',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, Sidebar],
  templateUrl: './payment-initiate.html'
})
export class PaymentInitiate implements OnInit {
  paymentForm!:   FormGroup;
  loading         = false;
  errorMessage    = '';
  paymentMethods: any[]        = [];
  caseId          = 0;
  hearingId:      number | null = null;

  constructor(
    private fb:                   FormBuilder,
    private paymentService:       PaymentService,
    private paymentMethodService: PaymentMethodService,
    private authService:          AuthService,
    private route:                ActivatedRoute,
    private router:               Router,
    private cdr:                  ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const params    = this.route.snapshot.queryParams;
    this.caseId     = +params['caseId']    || 0;
    this.hearingId  = params['hearingId']  ? +params['hearingId'] : null;
    const amount    = params['amount']     || '';

    // Prefill user info from JWT
    const user = this.authService.getUser();

    this.paymentForm = this.fb.group({
      caseId:          [this.caseId,       Validators.required],
      amount:          [amount,            Validators.required],
      paymentMethodId: ['',               Validators.required],
      customerName:    [user?.userName    || '', Validators.required],
      customerEmail:   [user?.email       || '', [Validators.required, Validators.email]],
      customerPhone:   ['',               Validators.required],
      customerAddress: [user?.address     || '', Validators.required]
    });

    this.loadPaymentMethods();
  }

  loadPaymentMethods(): void {
    this.paymentMethodService.getAll().subscribe({
      next: (res) => {
        if (res.success) {
          this.paymentMethods = res.data;
          this.cdr.detectChanges();
        }
      },
      error: () => {}
    });
  }

  isInvalid(field: string): boolean {
    const c = this.paymentForm.get(field);
    return !!(c?.invalid && c?.touched);
  }

  onSubmit(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.loading      = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    const v = this.paymentForm.value;

    const payload = {
      caseId:          +v.caseId,
      hearingId:       this.hearingId,   // ✅ null for consultation, number for hearing
      amount:          +v.amount,
      paymentMethodId: +v.paymentMethodId,
      customerName:    v.customerName,
      customerEmail:   v.customerEmail,
      customerPhone:   v.customerPhone,
      customerAddress: v.customerAddress
    };

    this.paymentService.initiate(payload).subscribe({
      next: (res) => {
        if (res.success && res.data.paymentUrl) {
          window.location.href = res.data.paymentUrl;  // ✅ leave Angular
        } else {
          this.errorMessage = res.message || 'Failed to initiate payment.';
          this.loading      = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Unable to connect.';
        this.loading      = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    if (this.caseId) this.router.navigate(['/cases', this.caseId]);
    else this.router.navigate(['/payments']);
  }
}
