import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HearingList } from './hearing-list';

describe('HearingList', () => {
  let component: HearingList;
  let fixture: ComponentFixture<HearingList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HearingList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HearingList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
