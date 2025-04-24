import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarAdvertisementService } from '../shared/services/car-advertisement.service';
import { InfoDialogComponent } from '../shared/components/info-dialog/info-dialog.component';
import { CarModel, EngineType, OptionalService, TrimLevel } from '../shared/constans/carAdvertisementConstants';

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
    'assets/carImages/kodiaq-yellow.png',
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

  constructor(private formBuilder:FormBuilder, private carAdvertisementService: CarAdvertisementService, private dialog: MatDialog) {}

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
    this.isLoading = true;
    if(this.carAdvertisementForm.valid) {
      this.carAdvertisementService.addCarAdvertisement(this.carAdvertisementForm.value).subscribe({
        next: (data) => {
          console.log(data);
          setTimeout(() => {
            this.isLoading = false
            const dialogRef = this.dialog.open(InfoDialogComponent, {data:'Advertisement successfully added.'})
          }, 1000);
        }, error: (err) => {
          console.log(err)
          setTimeout(() => {
            this.isLoading = false

          })
        }
      });
    }
  }

  goBack() {

  }

}
