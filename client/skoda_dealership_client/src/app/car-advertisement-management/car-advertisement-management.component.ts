import { Component } from '@angular/core';
import { CarAdvertisementService } from '../shared/services/car-advertisement.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { availableImages, CarModel, EngineType, OptionalService, TrimLevel } from '../shared/constans/carAdvertisementConstants';
import { MongoCarAdvertisement } from '../shared/model/mongo/MongoCarAdvertisement';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-car-advertisement-management',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatToolbarModule, MatGridListModule, ReactiveFormsModule],
  templateUrl: './car-advertisement-management.component.html',
  styleUrl: './car-advertisement-management.component.scss'
})

export class CarAdvertisementManagementComponent {
  carAdvertisements: MongoCarAdvertisement[] = [];
  carForms!: FormGroup[];

  carModelOptions = Object.values(CarModel);
  engineTypes = Object.values(EngineType);
  trimLevelOptions = Object.values(TrimLevel);
  optionalServiceOptions = Object.values(OptionalService);
  availableImages = [...availableImages];

  constructor(private fb: FormBuilder, private carAdvertisementService: CarAdvertisementService) {}

  ngOnInit() {
    this.carAdvertisementService.getAll().subscribe({
      next: (data) => {
        this.carAdvertisements = data;
        console.log(this.carAdvertisements)
        this.createForms();
      }
    });
  }

  createForms() {
    this.carForms = this.carAdvertisements.map(car => this.fb.group({
      _id: [car._id],
      carModel: [car.carModel],
      engine: [car.engine],
      image: [car.image],
      mileage: [car.mileage],
      optionalService: [car.optionalService || ''],
      price: [car.price,],
      trimLevel: [car.trimLevel],
      __v: [car.__v]
    }));
  }

  onUpdate(index: number) {
    const formValue = this.carForms[index].value;

    const newMongoCarAdvertisement:MongoCarAdvertisement = {
      _id: this.carAdvertisements[index]._id,
      __v: this.carAdvertisements[index].__v,
      carModel: this.carAdvertisements[index].carModel,
      engine: this.carAdvertisements[index].engine,
      image: formValue.image,
      mileage: formValue.mileage,
      optionalService: formValue.optionalService,
      price: formValue.price,
      trimLevel: formValue.trimLevel,
    }

    this.carAdvertisementService.update(newMongoCarAdvertisement).subscribe({
      next: (updatedCar:MongoCarAdvertisement) => {
        this.carAdvertisements[index] = updatedCar;
        this.carForms[index].markAsPristine();
        console.log('Update successful', updatedCar);
      },
      error: (error) => {
        console.error('Update failed:', error);
      this.carForms[index].patchValue(this.carAdvertisements[index]);
      }
    })
}

  onDelete(_id:string) {
    console.log(_id)
    this.carAdvertisementService.delete(_id).subscribe({
      next: (data) => {
        console.log(data)
        this.carAdvertisements = this.carAdvertisements.filter(car => car._id !== _id);
        const index = this.carAdvertisements.findIndex(car => car._id === _id);
        if (index !== -1) {
          this.carForms.splice(index, 1);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

}