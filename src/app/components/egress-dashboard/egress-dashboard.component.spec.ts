import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgressDashboardComponent } from './egress-dashboard.component';

describe('EgressDashboardComponent', () => {
  let component: EgressDashboardComponent;
  let fixture: ComponentFixture<EgressDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EgressDashboardComponent]
    });
    fixture = TestBed.createComponent(EgressDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
