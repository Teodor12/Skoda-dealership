import { Component } from '@angular/core';
import { MongoUser } from '../shared/model/mongo/MongoUser';
import { UserService } from '../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { MongoAppointment } from '../shared/model/mongo/MongoAppointment';
import { MongoTestDrive } from '../shared/model/mongo/MongoTestDrive';
import { TestDriveService } from '../shared/services/test-drive/test-drive.service';
import { AppointmentService } from '../shared/services/appointment/appointment.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../shared/components/info-dialog/info-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ErrorDialogComponent } from '../shared/components/error-dialog/error-dialog.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatProgressSpinnerModule, RouterModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})

export class MyProfileComponent {

  loggedInUser: MongoUser | null = null;
  appointments: MongoAppointment[] = [];
  testDrives: MongoTestDrive[] = [];

  testDriveForms!: FormGroup[];
  appointmentForms!: FormGroup[];

  isAdmin = false;
  isLoading = false;

  constructor(private router: Router, private authService: AuthService, private userService: UserService, private testDriveService: TestDriveService, private appointmentService: AppointmentService, private fb: FormBuilder, private dialog: MatDialog
  ) { }

  ngOnInit() {
    const loggedInUserEmail = localStorage.getItem('currentUser');

    if (loggedInUserEmail) {
      this.userService.getUserByEmail(loggedInUserEmail).subscribe({
        next: (user) => {
          this.loggedInUser = user;
          console.log(JSON.stringify(this.loggedInUser));
          if (this.loggedInUser.email === 'admin@gmail.com') {
            this.isAdmin = true
            return;
          }

          // Query the user's test drives, create forms
          this.testDriveService.getAll().subscribe({
            next: (testdrives) => {
              this.testDrives = testdrives.filter(testdrive => testdrive.user?.email === loggedInUserEmail)
            }
          });

          // Query the user's appointments, create forms
          this.appointmentService.getAll().subscribe({
            next: (appointments) => {
              this.appointments = appointments.filter(appointment => appointment.user?.email === loggedInUserEmail);
            }
          });
        },
      });
    }
  }

  logout() {
    this.isLoading = true
    this.authService.logout().subscribe({
      next: (data) => {
        console.log(data);
        localStorage.removeItem('currentUser')
        setTimeout(() => {
          this.isLoading = false;
          const dialogRef = this.dialog.open(InfoDialogComponent, {
            data: 'Sikeresen kijelentkeztél.',
          });
          dialogRef.afterClosed().subscribe(() => {
            this.router.navigateByUrl('/login');
          });
        }, 1000);
      }, error: (err) => {
        console.log(err);
        const dialogRef = this.dialog.open(ErrorDialogComponent, {
          data: 'Sikertelen kijelentkezés!',
        });
      }
    });
  }


  deleteTestDrive(_id: string) {
    this.isLoading = true
    this.testDriveService.delete(_id).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.isLoading = false;
          this.testDrives = this.testDrives.filter(testDrive => testDrive._id !== _id);
          const dialogRef = this.dialog.open(InfoDialogComponent, {
            data: 'Tesztvezetés sikeresen lemondva',
          });
        }, 1000);
        console.log(data)
      },
      error: (err) => {
        console.error(err)
        setTimeout(() => {
          this.isLoading = false;
          const dialogRef = this.dialog.open(ErrorDialogComponent, {
            data: 'Nem sikerült a tesztvezetést lemondani!',
          });
        }, 1000);
      }
    })
  }

  deleteAppointment(_id: string) {
    this.isLoading = true
    this.appointmentService.delete(_id).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.isLoading = false;
          this.appointments = this.appointments.filter(appointment => appointment._id !== _id);
          const dialogRef = this.dialog.open(InfoDialogComponent, {
            data: 'Időpont sikeresen lemondva.',
          });
        }, 1000);
        console.log(data)
      },
      error: (err) => {
        console.error(err)
        setTimeout(() => {
          this.isLoading = false;
          const dialogRef = this.dialog.open(ErrorDialogComponent, {
            data: 'Nem sikerült az időpont lemondani!',
          });
        }, 1000);
      }
    })
  }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }
}
