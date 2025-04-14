import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { MongoUser } from '../model/mongo/MongoUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<MongoUser[]>('http://localhost:5000/app/getAllUsers', {withCredentials: true});
  }

  delete(_id: string) {
    return this.http.delete('http://localhost:5000/app/deleteUser?id=' + _id, {withCredentials: true});
  }
}
