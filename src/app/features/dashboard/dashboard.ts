import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CaseService } from '../../core/services/case.service';
import { AuthService } from '../../core/services/auth.service';
import { Sidebar} from '../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, Sidebar],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  today        = '';
  isAdmin      = false;
  isLawyer     = false;
  isClient     = false;
  recentCases: any[] = [];

  stats = {
    totalCases:    0,
    totalPayments: 0,
    totalHearings: 0,
    totalUsers:    0
  };

  constructor(
    private caseService: CaseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const role    = this.authService.getRole();
    this.isAdmin  = role === 'Admin';
    this.isLawyer = role === 'Lawyer';
    this.isClient = role === 'Client';

    this.today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year:    'numeric',
      month:   'long',
      day:     'numeric'
    });

    this.loadStats();
  }

  loadStats(): void {
    this.caseService.getAll().subscribe({
      next: (res) => {
        if (res.success) {
          this.stats.totalCases = res.data.length;
          this.recentCases      = res.data.slice(0, 5);
        }
      },
      error: () => {}
    });
  }
}
