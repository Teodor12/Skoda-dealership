import { CarAdvertisement } from "../CarAdvertisement";

export interface MongoCarAdvertisement extends CarAdvertisement {
    _id: string;
    __v: number;
}