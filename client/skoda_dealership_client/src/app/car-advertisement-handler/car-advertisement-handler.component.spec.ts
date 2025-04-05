import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarAdvertisementHandlerComponent } from './car-advertisement-handler.component';

describe('CarAdvertisementHandlerComponent', () => {
  let component: CarAdvertisementHandlerComponent;
  let fixture: ComponentFixture<CarAdvertisementHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarAdvertisementHandlerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarAdvertisementHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
