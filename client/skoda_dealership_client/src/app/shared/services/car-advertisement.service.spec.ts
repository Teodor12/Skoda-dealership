import { TestBed } from '@angular/core/testing';

import { CarAdvertisementService } from './car-advertisement.service';

describe('CarAdvertisementService', () => {
  let service: CarAdvertisementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarAdvertisementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
