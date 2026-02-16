import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodList } from './payment-method-list';

describe('PaymentMethodList', () => {
  let component: PaymentMethodList;
  let fixture: ComponentFixture<PaymentMethodList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentMethodList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentMethodList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
