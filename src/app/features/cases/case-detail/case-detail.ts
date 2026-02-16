import {
  Component, OnInit,
  ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseService } from '../../../core/services/case.service';
import { AuthService } from '../../../core/services/auth.service';
import { FileService } from '../../../core/services/file.service';
import { HearingService } from '../../../core/services/hearing.service';
import { PaymentService } from '../../../core/services/payment.service';
import { PaymentMethodService } from '../../../core/services/payment-method.service';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-case-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, Sidebar],
  providers: [DatePipe],
  templateUrl: './case-detail.html'
})
export class CaseDetail implements OnInit {
  caseDetail:   any    = null;
  loading              = true;
  errorMessage         = '';
  successMessage       = '';
  isAdmin              = false;
  isLawyer             = false;
  isClient             = false;
  caseId!:      number;
  cashMethodId: number = 0;

  // ✅ Track loading state per hearing
  cashLoading                    = false;
  cashLoadingHearing: number | null = null;

  constructor(
    private route:               ActivatedRoute,
    private router:              Router,
    private caseService:         CaseService,
    private authService:         AuthService,
    private fileService:         FileService,
    private hearingService:      HearingService,
    private paymentService:      PaymentService,
    private paymentMethodService: PaymentMethodService,
    private cdr:                 ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const role    = this.authService.getRole();
    this.isAdmin  = role === 'Admin';
    this.isLawyer = role === 'Lawyer';
    this.isClient = role === 'Client';

    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || isNaN(+idParam)) {
      this.router.navigate(['/cases']);
      return;
    }

    this.caseId = +idParam;

    // ✅ Load cash method id for Admin/Lawyer
    if (this.isAdmin || this.isLawyer) {
      this.paymentMethodService.getCashMethodId().subscribe({
        next: (id) => {
          this.cashMethodId = id ?? 0;
          this.cdr.detectChanges();
        }
      });
    }

    this.loadCase();
  }

  loadCase(): void {
    this.loading      = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.caseService.getById(this.caseId).subscribe({
      next: (res) => {
        if (res.success) this.caseDetail = res.data;
        else this.errorMessage           = res.message;
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

  // ── File helpers ───────────────────────────────────────
  getFileIcon(contentType: string): string {
    if (contentType?.includes('pdf'))   return '📄';
    if (contentType?.includes('image')) return '🖼️';
    if (contentType?.includes('word'))  return '📝';
    if (contentType?.includes('sheet')) return '📊';
    return '📎';
  }

  formatSize(bytes: number): string {
    if (!bytes)              return '—';
    if (bytes < 1024)        return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  downloadFile(fileId: string, fileName: string): void {
    this.fileService.download(fileId).subscribe({
      next: (blob) => {
        const url  = window.URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.errorMessage = 'Failed to download file.';
        this.cdr.detectChanges();
      }
    });
  }

  // ── Case payment ───────────────────────────────────────

  // Client pays online
  payOnline(): void {
    this.router.navigate(['/payments/initiate'], {
      queryParams: {
        caseId: this.caseId,
        amount: this.caseDetail.fee
      }
    });
  }

  // ✅ Admin/Lawyer records cash — one click
  recordCash(): void {
    if (!this.cashMethodId) {
      this.errorMessage =
        'Cash payment method not found. Please add it in Payment Methods.';
      this.cdr.detectChanges();
      return;
    }

    if (!confirm(
      `Record cash payment of ৳${this.caseDetail.fee} for this case?`
    )) return;

    this.cashLoading  = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.paymentService.cashPayment({
      caseId:          this.caseId,
      hearingId:       null,
      amount:          this.caseDetail.fee,
      paymentMethodId: this.cashMethodId
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage = 'Cash payment recorded successfully!';
          this.loadCase();   // ✅ reload to show Paid
        } else {
          this.errorMessage = res.message || 'Failed to record payment.';
        }
        this.cashLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Unable to record payment.';
        this.cashLoading  = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ── Hearing payment ────────────────────────────────────

  // Client pays hearing online
  payHearingOnline(hearingId: number): void {
    this.router.navigate(['/payments/initiate'], {
      queryParams: {
        caseId:    this.caseId,
        hearingId: hearingId,
        amount:    this.caseDetail.fee
      }
    });
  }

  // ✅ Admin/Lawyer records hearing cash — one click
  recordHearingCash(hearingId: number): void {
    if (!this.cashMethodId) {
      this.errorMessage =
        'Cash payment method not found. Please add it in Payment Methods.';
      this.cdr.detectChanges();
      return;
    }

    if (!confirm(
      `Record cash payment of ৳${this.caseDetail.fee} for this hearing?`
    )) return;

    this.cashLoadingHearing = hearingId;
    this.errorMessage       = '';
    this.cdr.detectChanges();

    this.paymentService.cashPayment({
      caseId:          this.caseId,
      hearingId:       hearingId,
      amount:          this.caseDetail.fee,
      paymentMethodId: this.cashMethodId
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage = 'Hearing cash payment recorded!';
          this.loadCase();   // ✅ reload to show Paid
        } else {
          this.errorMessage = res.message || 'Failed.';
        }
        this.cashLoadingHearing = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage       =
          err.error?.message || 'Unable to record payment.';
        this.cashLoadingHearing = null;
        this.cdr.detectChanges();
      }
    });
  }

  // ── Case actions ───────────────────────────────────────
  editCase(): void {
    this.router.navigate(['/cases/edit', this.caseId]);
  }

  deleteCase(): void {
    if (!confirm('Delete this case?')) return;
    this.caseService.delete(this.caseId).subscribe({
      next: (res) => {
        if (res.success) this.router.navigate(['/cases']);
        else {
          this.errorMessage = res.message;
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.errorMessage = 'Failed to delete case.';
        this.cdr.detectChanges();
      }
    });
  }

  // ── Hearing actions ────────────────────────────────────
  addHearing(): void {
    this.router.navigate(['/hearings/create'],
      { queryParams: { caseId: this.caseId } });
  }

  editHearing(hearingId: number): void {
    this.router.navigate(['/hearings/edit', hearingId],
      { queryParams: { caseId: this.caseId } });
  }

  deleteHearing(hearingId: number): void {
    if (!confirm('Delete this hearing?')) return;
    this.hearingService.delete(hearingId).subscribe({
      next: (res) => {
        if (res.success) this.loadCase();
        else {
          this.errorMessage = res.message;
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.errorMessage = 'Failed to delete hearing.';
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void { this.router.navigate(['/cases']); }
}
