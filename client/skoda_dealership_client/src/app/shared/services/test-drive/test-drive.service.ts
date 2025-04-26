import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TestDrive } from '../../model/TestDrive';
import { MongoTestDrive } from '../../model/mongo/MongoTestDrive';


@Injectable({
  providedIn: 'root'
})
export class TestDriveService {

  private apiUrl = 'http://localhost:5000/app';

  constructor(private http: HttpClient) { }

  addTestDrive(testDrive:TestDrive) {
    console.log('calling addTestDrive...')

    const body = new URLSearchParams();
    body.set('user', testDrive.userID)
    body.set('carAdvertisement', testDrive.carAdvertisementID)
    body.set('testDriveDate', testDrive.testDriveDate.toISOString())

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post('http://localhost:5000/app/addTestDrive', body, {headers: headers});
  }

  getAll() {
    return this.http.get<MongoTestDrive[]>('http://localhost:5000/app/getAllTestDrives', {withCredentials: true});
  }
}
