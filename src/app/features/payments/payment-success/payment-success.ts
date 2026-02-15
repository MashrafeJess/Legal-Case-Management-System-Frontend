import {
  Component, OnInit, OnDestroy,
  ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './payment-success.html'
})
export class PaymentSuccess implements OnInit, OnDestroy {
  countdown  = 3;
  private timer: any;

  constructor(
    private router: Router,
    private cdr:    ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.countdown--;
      this.cdr.detectChanges();
      if (this.countdown === 0) {
        clearInterval(this.timer);
        this.router.navigate(['/payments']);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  goToPayments(): void {
    clearInterval(this.timer);
    this.router.navigate(['/payments']);
  }
}
