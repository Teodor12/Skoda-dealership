import { Component } from '@angular/core';
import { CarAdvertisementService } from '../shared/services/car-advertisement.service';
import { MongoCarAdvertisement } from '../shared/model/mongo/MongoCarAdvertisement';
import { CarModel } from '../shared/constans/carAdvertisementConstants';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../shared/services/user.service';
import { MongoUser } from '../shared/model/mongo/MongoUser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TestDrive } from '../shared/model/TestDrive';
import { TestDriveService } from '../shared/services/test-drive/test-drive.service';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../shared/components/info-dialog/info-dialog.component';
import { ErrorDialogComponent } from '../shared/components/error-dialog/error-dialog.component';

@Component({
  selector: 'app-car-advertisement-viewer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './car-advertisement-viewer.component.html',
  styleUrl: './car-advertisement-viewer.component.scss',
})

export class CarAdvertisementViewerComponent {
  testDriveForms!: FormGroup[];
  appointmentForms!: FormGroup[];

  carAdvertisements: MongoCarAdvertisement[] = [];
  filteredCarAdvertisements: MongoCarAdvertisement[] = [];
  loggedInUserEmail: string | null = null;
  loggedInUser: MongoUser | null = null;

  minDate = new Date();
  maxDate = new Date(new Date().setFullYear(this.minDate.getFullYear() + 1));

  priceFilter = 15000000;
  mileageFilter = 5000;
  carModels: string[] = Object.values(CarModel);
  modelFilter = '';

  isLoading = false;

  ngOnInit() {
    this.loggedInUserEmail = localStorage.getItem('currentUser');
    if (this.loggedInUserEmail) {
      this.userService.getUserByEmail(this.loggedInUserEmail).subscribe({
        next: (user) => {
          this.loggedInUser = user;
          console.log(JSON.stringify(this.loggedInUser));
        },
      });
    }

    this.carAdvertisementService.getAll().subscribe({
      next: (data) => {
        this.carAdvertisements = data;
        this.applyFilters();
        this.createForms();
        console.log(this.carAdvertisements);
      },
    });
  }

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private carAdvertisementService: CarAdvertisementService,
    private testDriverService: TestDriveService,
    private dialog: MatDialog
  ) {}

  createForms() {
    this.testDriveForms = this.carAdvertisements.map((carAdvertisement) =>
      this.fb.group({
        testDriveDate: [''],
        carAdvertisementID: carAdvertisement._id,
      })
    );

    this.appointmentForms = this.carAdvertisements.map((carAdvertisement) =>
      this.fb.group({
        carAdvertisementID: carAdvertisement._id,
      })
    );
  }

  applyFilters() {
    this.filteredCarAdvertisements = this.carAdvertisements.filter((car) => {
      const priceMatch = car.price <= this.priceFilter;
      const mileageMatch = car.mileage <= this.mileageFilter;
      const modelMatch =
        this.modelFilter === '' || car.carModel === this.modelFilter;
      return priceMatch && mileageMatch && modelMatch;
    });
  }

  onTestDriveSubmit(idx: number) {
    this.isLoading = true;
    if (!this.loggedInUser) {
      console.error('user is not logged in!');
      return;
    }

    const form = this.testDriveForms[idx];
    const date = form.value.testDriveDate;
    const carAdID = form.value.carAdvertisementID;

    const newTestDrive: TestDrive = {
      userID: this.loggedInUser._id,
      carAdvertisementID: carAdID,
      testDriveDate: new Date(date),
    };

    this.testDriverService.addTestDrive(newTestDrive).subscribe({
      next: (data) => {
        console.log(data);
        setTimeout(() => {
          this.isLoading = false;
          const dialogRef = this.dialog.open(InfoDialogComponent, {data:'Sikeres időpontfoglalás tesztvezetéshez!'})
        }, 1000);
      },
      error: (err) => {
        console.error(err);
        setTimeout(() => {
          this.isLoading = false;
          const dialogRef = this.dialog.open(ErrorDialogComponent, {data:'Nem sikerült időpontot foglalni!'})
        }, 1000);
      },
    });
  }

  onAppointmentSubmit(index: number) {
    console.log(this.testDriveForms[index].value);
  }

  getCurrentUser(email: string) {
    return this.userService.getUserByEmail(email);
  }
}
