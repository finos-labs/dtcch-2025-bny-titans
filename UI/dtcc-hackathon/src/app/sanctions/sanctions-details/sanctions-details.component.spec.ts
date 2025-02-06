import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionsDetailsComponent } from './sanctions-details.component';

describe('SanctionsDetailsComponent', () => {
  let component: SanctionsDetailsComponent;
  let fixture: ComponentFixture<SanctionsDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SanctionsDetailsComponent]
    });
    fixture = TestBed.createComponent(SanctionsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
