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
import { AppointmentType } from '../shared/constans/appointmentConstants';
import { Appointment } from '../shared/model/Appointment';
import { AppointmentService } from '../shared/services/appointment/appointment.service';

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
  appointmentTypes: string[] = Object.values(AppointmentType);
  modelFilter = '';

  isLoading = false;

  ngOnInit() {
    const loggedInUserEmail = localStorage.getItem('currentUser');
    if (loggedInUserEmail) {
      this.userService.getUserByEmail(loggedInUserEmail).subscribe({
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
      },
    });
  }

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private carAdvertisementService: CarAdvertisementService,
    private testDriverService: TestDriveService,
    private appointmentService: AppointmentService,
    private dialog: MatDialog
  ) {}

  createForms() {
    this.testDriveForms = this.filteredCarAdvertisements.map((carAdvertisement) =>
      this.fb.group({
        testDriveDate: [''],
        carAdvertisementID: carAdvertisement._id,
      })
    );

    this.appointmentForms = this.filteredCarAdvertisements.map((carAdvertisement) =>
      this.fb.group({
        appointmentType: [''],
        appointmentDate: [''],
        carAdvertisementID: carAdvertisement._id,
      })
    );
  }

  applyFilters() {
    this.filteredCarAdvertisements = this.carAdvertisements.filter((car) => {
      const priceMatch = car.price <= this.priceFilter;
      const mileageMatch = car.mileage <= this.mileageFilter;
      const modelMatch = this.modelFilter === '' || car.carModel === this.modelFilter;
      return priceMatch && mileageMatch && modelMatch;
    });

    this.createForms()
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
          const dialogRef = this.dialog.open(InfoDialogComponent, {
            data: 'Sikeres időpontfoglalás tesztvezetéshez!',
          });
        }, 1000);
      },
      error: (err) => {
        console.error(err);
        setTimeout(() => {
          this.isLoading = false;
          const dialogRef = this.dialog.open(ErrorDialogComponent, {
            data: 'Nem sikerült időpontot foglalni a tesztvezetéshez!',
          });
        }, 1000);
      },
    });
  }

  onAppointmentSubmit(idx: number) {

    this.isLoading = true

    if (!this.loggedInUser) {
      console.error('A felhasználó nincs bejelentkezve');
      return;
    }

    const form = this.appointmentForms[idx];
    const date = form.value.appointmentDate;
    const appointmentType = form.value.appointmentType;
    const carAdID = form.value.carAdvertisementID;

    const newAppointment: Appointment = {
      userID: this.loggedInUser._id,
      carAdvertisementID: carAdID,
      appointmentType:appointmentType,
      appointmentDate: new Date(date)
    }

    this.appointmentService.addAppointment(newAppointment).subscribe({
      next: (data) => {
        console.log(data);
        setTimeout(() => {
          this.isLoading = false;
          const dialogRef = this.dialog.open(InfoDialogComponent, {
            data: 'Sikeres időpontfoglalás!',
          });
        }, 1000);
      },
      error: (err) => {
        console.error(err)
        setTimeout(() => {
          this.isLoading = false;
          const dialogRef = this.dialog.open(ErrorDialogComponent, {
            data: 'Nem sikerült időpontot foglalni!',
          });
        }, 1000);
      }
    })

  }

  getCurrentUser(email: string) {
    return this.userService.getUserByEmail(email);
  }
}
