import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentViewerComponent } from './appointment-viewer.component';

describe('AppointmentViewerComponent', () => {
  let component: AppointmentViewerComponent;
  let fixture: ComponentFixture<AppointmentViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppointmentViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
