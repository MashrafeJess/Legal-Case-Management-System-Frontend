import {
  Component, OnInit,
  ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../core/services/payment.service';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-payment-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, Sidebar],
  providers: [DatePipe, DecimalPipe],
  templateUrl: './payment-detail.html'
})
export class PaymentDetail implements OnInit {
  payment:    any    = null;
  loading            = true;
  errorMessage       = '';
  paymentId!: string;

  constructor(
    private route:          ActivatedRoute,
    private router:         Router,
    private paymentService: PaymentService,
    private cdr:            ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.paymentId = this.route.snapshot.paramMap.get('id')!;
    this.loadPayment();
  }

  loadPayment(): void {
    this.loading      = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.paymentService.getByPaymentId(this.paymentId).subscribe({
      next: (res) => {
        if (res.success) this.payment = res.data;
        else this.errorMessage        = res.message;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load payment.';
        this.loading      = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewCase(): void {
    this.router.navigate(['/cases', this.payment.caseId]);
  }

  goBack(): void {
    this.router.navigate(['/payments']);
  }
}
