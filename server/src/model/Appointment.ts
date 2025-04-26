import mongoose, { Model, Schema } from "mongoose";

import { AppointmentType } from "../constants/appointmentConstants";

export interface IAppointment extends Document {
    user: mongoose.Types.ObjectId;
    carAdvertisement: mongoose.Types.ObjectId;
    appointmentDate: Date
    appointmentType: AppointmentType
}

const AppointmentSchema: Schema<IAppointment> = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    carAdvertisement: { type: mongoose.Schema.Types.ObjectId, ref: 'CarAdvertisement', required: true },
    appointmentDate: { type: Date, required: true },
    appointmentType: {type:String, enum: Object.values(AppointmentType), required: true}
});

export const Appointment: Model<IAppointment> = mongoose.model<IAppointment>('Appointment', AppointmentSchema);
