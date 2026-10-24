import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerPageHeaderComponent } from './inner-page-header.component';

describe('InnerPageHeaderComponent', () => {
  let component: InnerPageHeaderComponent;
  let fixture: ComponentFixture<InnerPageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InnerPageHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnerPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
