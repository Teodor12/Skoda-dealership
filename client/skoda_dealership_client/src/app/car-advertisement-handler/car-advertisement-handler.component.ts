import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './car-advertisement-handler.component.html',
  styleUrls: ['./car-advertisement-handler.component.scss']
})

export class CarAdvertisementHandlerComponent {

  availableImages: string[] = [
    'assets/carImages/fabia-blue.png',
    'assets/carImages/fabia-red.png',
    'assets/carImages/fabia-white.png',
    'assets/carImages/karoq-black.png',
    'assets/carImages/karoq-orange.png',
    'assets/carImages/karoq-red.png',
    'assets/carImages/kodiaq-white.png',
    'assets/carImages/kodiaq-blue.png',
    'assets/carImages/yellow-white.png',
    'assets/carImages/octavia-black.png',
    'assets/carImages/octavia-grey.png',
    'assets/carImages/octavia-white.png',
    'assets/carImages/superb-green.png',
    'assets/carImages/superb-grey.png',
    'assets/carImages/superb-red.png',
  ]

  carModels: string[] = Object.values(CarModel)
  engineTypes: string[] = Object.values(EngineType)
  trimLevels: string[] = Object.values(TrimLevel)
  optionalServices: string[] = Object.values(OptionalService)

  carAdvertisementForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(private formBuilder:FormBuilder, private dialog: MatDialog)
  {

  }

  ngOnInit() {
      this.carAdvertisementForm = this.formBuilder.group({
        carModel: ['', [Validators.required]],
        engine: ['', [Validators.required]],
        mileage: ['', [Validators.required]],
        trimLevel: ['', [Validators.required]],
        optionalService: ['', Validators.required],
        image: ['', Validators.required],
        price: ['', Validators.required]
    })
  }

  onSubmit() {

  }

  goBack() {

  }


}

export enum CarModel {
  Fabia = 'Fabia',
  Octavia = 'Octavia',
  Superb = 'Superb',
  Kodiaq = 'Kodiaq',
  Enyaq = 'Enyaq'
}

export enum EngineType {
  OneZeroTSI = "1.0 TSI",
  OneFiveTSI = "1.5 TSI",
  OneSixTDI = "1.6 TDI",
  TwoZeroTDI = "2.0 TDI"
}

export enum TrimLevel {
  Essence = 'Essence',
  Selection = 'Selection',
  LK = 'LK',
  RS = 'RS'
}

export enum OptionalService {
  OneYearWarranty = '1 év garancia',
  ThreeYearWarranty = '3 év garancia',
  SmallServiceDiscount = 'Kedvezményes kis szervíz',
  LargeServiceDiscount = 'Kedvezményes nagy szervíz'
}



