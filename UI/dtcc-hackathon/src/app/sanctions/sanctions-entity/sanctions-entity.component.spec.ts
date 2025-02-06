import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionsEntityComponent } from './sanctions-entity.component';

describe('SanctionsEntityComponent', () => {
  let component: SanctionsEntityComponent;
  let fixture: ComponentFixture<SanctionsEntityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SanctionsEntityComponent]
    });
    fixture = TestBed.createComponent(SanctionsEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
