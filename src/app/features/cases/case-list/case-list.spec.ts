import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseList } from './case-list';

describe('CaseList', () => {
  let component: CaseList;
  let fixture: ComponentFixture<CaseList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
