import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Appointment } from '../../model/Appointment';
import { MongoAppointment } from '../../model/mongo/MongoAppointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient ) { }

  addAppointment(appointment:Appointment) {
      const body = new URLSearchParams();
      body.set('user', appointment.userID)
      body.set('carAdvertisement', appointment.carAdvertisementID)
      body.set('appointmentDate', appointment.appointmentDate.toISOString())
      body.set('appointmentType', appointment.appointmentType.toString())

      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      });

      console.log(JSON.stringify(body))

      return this.http.post('http://localhost:5000/app/addAppointment', body, {headers: headers});
    }

  getAll() {
    return this.http.get<MongoAppointment[]>('http://localhost:5000/app/getAllAppointments', {withCredentials: true});
  }

  delete(_id:string) {
    return this.http.delete('http://localhost:5000/app/deleteAppointment?id=' + _id, {withCredentials: true});
  }
}
