import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MongoAppointment } from '../shared/model/mongo/MongoAppointment';
import { AppointmentService } from '../shared/services/appointment/appointment.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-appointment-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './appointment-viewer.component.html',
  styleUrl: './appointment-viewer.component.scss'
})
export class AppointmentViewerComponent {
  appointments: MongoAppointment[] = [];

  constructor(private appointmentService: AppointmentService) { }

  ngOnInit() {
    this.appointmentService.getAll().subscribe({
      next: (data) => {
        this.appointments = data;
        console.log(this.appointments)
      }
    });
  }
}
