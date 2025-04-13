import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarAdvertisementManagementComponent } from './car-advertisement-management.component';

describe('CarAdvertisementManagementComponent', () => {
  let component: CarAdvertisementManagementComponent;
  let fixture: ComponentFixture<CarAdvertisementManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarAdvertisementManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarAdvertisementManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
