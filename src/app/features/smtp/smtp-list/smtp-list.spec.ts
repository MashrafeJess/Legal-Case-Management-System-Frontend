import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtpList } from './smtp-list';

describe('SmtpList', () => {
  let component: SmtpList;
  let fixture: ComponentFixture<SmtpList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmtpList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmtpList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
