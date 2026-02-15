import {
  Component, OnInit,
  ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule, SlicePipe, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PaymentService } from '../../../core/services/payment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink, Sidebar],
  providers: [SlicePipe, DecimalPipe, DatePipe],
  templateUrl: './payment-list.html'
})
export class PaymentList implements OnInit {
  payments:     any[]         = [];
  loading                     = true;
  errorMessage                = '';
  searchCaseId: number | null = null;
  isAdmin                     = false;
  isLawyer                    = false;
  isClient                    = false;

  constructor(
    private paymentService: PaymentService,
    private authService:    AuthService,
    private router:         Router,
    private cdr:            ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const role   = this.authService.getRole();
    this.isAdmin  = role === 'Admin';
    this.isLawyer = role === 'Lawyer';
    this.isClient = role === 'Client';

    this.loadAll();

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.loadAll());
  }

  loadAll(): void {
    this.loading      = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.paymentService.getAll().subscribe({
      next: (res) => {
        if (res.success) this.payments = res.data;
        else this.errorMessage         = res.message;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load payments.';
        this.loading      = false;
        this.cdr.detectChanges();
      }
    });
  }

  searchByCaseId(): void {
    if (!this.searchCaseId) {
      this.loadAll();
      return;
    }

    this.loading      = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.paymentService.getByCaseId(this.searchCaseId).subscribe({
      next: (res) => {
        if (res.success) this.payments = res.data;
        else this.errorMessage         = res.message;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load payments.';
        this.loading      = false;
        this.cdr.detectChanges();
      }
    });
  }

  clearSearch(): void {
    this.searchCaseId = null;
    this.errorMessage = '';
    this.loadAll();
  }

  viewPayment(paymentId: string): void {
    this.router.navigate(['/payments', paymentId]);
  }

  viewCase(caseId: number): void {
    this.router.navigate(['/cases', caseId]);
  }
}
