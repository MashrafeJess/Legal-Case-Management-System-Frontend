import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseTypeList } from './case-type-list';

describe('CaseTypeList', () => {
  let component: CaseTypeList;
  let fixture: ComponentFixture<CaseTypeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseTypeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseTypeList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
