import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-failed',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './payment-failed.html'
})
export class PaymentFailed {
  constructor(private router: Router) {}
  tryAgain():       void { this.router.navigate(['/payments/initiate']); }
  goToDashboard():  void { this.router.navigate(['/dashboard']); }
}
