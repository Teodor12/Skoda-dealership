import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarAdvertisementViewerComponent } from './car-advertisement-viewer.component';

describe('CarAdvertisementViewerComponent', () => {
  let component: CarAdvertisementViewerComponent;
  let fixture: ComponentFixture<CarAdvertisementViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarAdvertisementViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarAdvertisementViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
