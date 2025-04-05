import mongoose, { Document, Model, Schema } from 'mongoose';

export enum CarModel {
    Fabia = 'Fabia',
    Octavia = 'Octavia',
    Superb = 'Superb',
    Kodiaq = 'Kodiaq',
    Enyaq = 'Enyaq'
  }

  export enum TrimLevel {
    Essence = 'Essence',
    Selection = 'Selection',
    LK = 'LK',
    RS = 'RS'
  }

  export enum OptionalService {
    OneYearWarranty = '1 év garancia',
    ThreeYearWarranty = '3 év garancia',
    SmallServiceDiscount = 'Kedvezményes kis szervíz',
    LargeServiceDiscount = 'Kedvezményes nagy szervíz'
  }

  export enum EngineType {
    OneZeroTSI = "1.0 TSI",
    OneFiveTSI = "1.5 TSI",
    OneSixTDI = "1.6 TDI",
    TwoZeroTDI = "2.0 TDI"
  }

  interface ICarAdvertisement extends Document {
    carModel: CarModel;
    engine: EngineType;
    mileage: number;
    trimLevel: TrimLevel;
    optionalService?: OptionalService;
    image: string;
    price: number;
  }

const CarAdvertisementSchema: Schema<ICarAdvertisement> = new mongoose.Schema({
    carModel: { type: String, enum: Object.values(CarModel), required: true},
    engine: { type: String, enum: Object.values(EngineType) , required: true },
    mileage: { type: Number, required: true },
    trimLevel: { type: String, enum: Object.values(TrimLevel), required: true },
    optionalService: { type: String,enum: Object.values(OptionalService), required: false},
    image: { type: String, required: true },
    price: { type: Number, required: true }
});

export const CarAdvertisement: Model<ICarAdvertisement> = mongoose.model<ICarAdvertisement>('CarAdvertisement', CarAdvertisementSchema);



