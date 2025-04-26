import { AppointmentType } from '../../constans/appointmentConstants';
import { MongoCarAdvertisement } from './MongoCarAdvertisement';
import { MongoUser } from './MongoUser';

export interface MongoAppointment {
  _id: string;
  user: MongoUser;
  carAdvertisement: MongoCarAdvertisement;
  appointmentDate: string;
  appointmentType: string;
  __v: number;
}
