import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralPractitionersComponent } from './general-practitioners.component';

describe('GeneralPractitionersComponent', () => {
  let component: GeneralPractitionersComponent;
  let fixture: ComponentFixture<GeneralPractitionersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralPractitionersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralPractitionersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
