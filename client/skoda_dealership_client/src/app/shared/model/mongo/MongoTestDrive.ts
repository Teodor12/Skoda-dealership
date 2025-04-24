import { MongoCarAdvertisement } from "./MongoCarAdvertisement";
import { MongoUser } from "./MongoUser";

export interface MongoTestDrive {
    _id: string;
    user: MongoUser;
    carAdvertisement: MongoCarAdvertisement;
    testDriveDate: string;
    __v: number;
}