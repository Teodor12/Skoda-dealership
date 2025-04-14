import { User } from "../User";

export interface MongoUser  extends User {
    _id: string;
    __v: number
}