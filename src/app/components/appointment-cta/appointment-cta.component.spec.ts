import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentCtaComponent } from './appointment-cta.component';

describe('AppointmentCtaComponent', () => {
  let component: AppointmentCtaComponent;
  let fixture: ComponentFixture<AppointmentCtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentCtaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentCtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
