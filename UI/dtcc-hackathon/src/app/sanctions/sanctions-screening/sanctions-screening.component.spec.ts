import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionsScreeningComponent } from './sanctions-screening.component';

describe('SanctionsScreeningComponent', () => {
  let component: SanctionsScreeningComponent;
  let fixture: ComponentFixture<SanctionsScreeningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SanctionsScreeningComponent]
    });
    fixture = TestBed.createComponent(SanctionsScreeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
