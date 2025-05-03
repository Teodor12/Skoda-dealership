import { Component} from '@angular/core';
import { MongoUser } from '../shared/model/mongo/MongoUser';
import { FilterAdminPipe } from '../shared/pipes/filter-admin.pipe';
import { CommonModule } from '@angular/common';
import { UserService } from '../shared/services/user.service';
import { InfoDialogComponent } from '../shared/components/info-dialog/info-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../shared/components/error-dialog/error-dialog.component';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FilterAdminPipe, MatProgressSpinnerModule, RouterModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})

export class UserManagementComponent {

    users: MongoUser[] = [];
    filterAdminPipe!:FilterAdminPipe
    isLoading = false

    constructor(private userService: UserService, private dialog: MatDialog) {}

    ngOnInit() {
      this.userService.getAll().subscribe({
        next: (data) => {
          this.users = data;
          console.log(this.users)
        }
      });
    }

    onDelete(_id:string) {
      this.isLoading = true
      this.userService.delete(_id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user._id !== _id);
          setTimeout(() => {
            this.isLoading = false
            const dialogRef = this.dialog.open(InfoDialogComponent, {data:'Felhasználó sikeresen törölve.'})
          }, 1000);
        },
        error: (err) => {
          const dialogRef = this.dialog.open(ErrorDialogComponent, {data:'Nem sikerült a felhasználót törölni!'})
        }
      });
    }

}
