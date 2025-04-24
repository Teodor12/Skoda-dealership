import mongoose, { Document, Model, Schema } from 'mongoose';
import { IUser } from './User';
import { ICarAdvertisement } from './CarAdvertisement';

export interface ITestDrive extends Document {
    user: IUser | mongoose.Types.ObjectId;
    carAdvertisement: ICarAdvertisement | mongoose.Types.ObjectId;
    testDriveDate:Date
}

const TestDriveSchema: Schema<ITestDrive> = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    carAdvertisement: { type: mongoose.Schema.Types.ObjectId, ref: 'CarAdvertisement', required: true },
    testDriveDate: { type: Date, required: true },
});

export const TestDrive: Model<ITestDrive> = mongoose.model<ITestDrive>('TestDrive', TestDriveSchema);