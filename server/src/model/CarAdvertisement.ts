import mongoose, { Document, Model, Schema } from 'mongoose';
import { CarModel, EngineType, OptionalService, TrimLevel } from '../constants/carAdvertisementConstants';

export interface ICarAdvertisement extends Document {
    carModel: CarModel;
    engine: EngineType;
    mileage: number;
    trimLevel: TrimLevel;
    optionalService: OptionalService;
    image: string;
    price: number;
  }

const CarAdvertisementSchema: Schema<ICarAdvertisement> = new mongoose.Schema({
    carModel: { type: String, enum: Object.values(CarModel), required: true},
    engine: { type: String, enum: Object.values(EngineType) , required: true },
    mileage: { type: Number, required: true },
    trimLevel: { type: String, enum: Object.values(TrimLevel), required: true },
    optionalService: { type: String,enum: Object.values(OptionalService), required: true},
    image: { type: String, required: true },
    price: { type: Number, required: true }
});

export const CarAdvertisement: Model<ICarAdvertisement> = mongoose.model<ICarAdvertisement>('CarAdvertisement', CarAdvertisementSchema);



