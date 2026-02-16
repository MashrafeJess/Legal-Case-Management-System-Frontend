import {
  Component, OnInit,
  ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CaseService } from '../../../core/services/case.service';
import { AuthService } from '../../../core/services/auth.service';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-case-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, Sidebar],
  templateUrl: './case-list.html'
})
export class CaseList implements OnInit {
  cases: any[] = [];
  loading = true;
  errorMessage = '';
  isAdmin = false;
  isLawyer = false;
  isClient = false;

  constructor(
    private caseService: CaseService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const role = this.authService.getRole();
    this.isAdmin = role === 'Admin';
    this.isLawyer = role === 'Lawyer';
    this.isClient = role === 'Client';
    this.loadCases();

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.loadCases());
  }

  loadCases(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    // ✅ All roles use same endpoint
    // Backend filters by role automatically
    this.caseService.getAll().subscribe({
      next: (res) => {
        if (res.success) this.cases = res.data;
        else this.errorMessage = res.message;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load cases.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewCase(id: number): void {
    this.router.navigate(['/cases', id]);
  }

  editCase(id: number): void {
    this.router.navigate(['/cases/edit', id]);
  }

  // ✅ Client pays consultation fee
  payFee(caseId: number, fee: number): void {
    this.router.navigate(['/payments/initiate'], {
      queryParams: { caseId, amount: fee }
    });
  }

  deleteCase(id: number): void {
    if (!confirm('Delete this case?')) return;
    this.caseService.delete(id).subscribe({
      next: (res) => {
        if (res.success) this.loadCases();
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
}
