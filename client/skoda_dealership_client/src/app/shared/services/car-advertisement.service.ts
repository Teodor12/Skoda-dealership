import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CarAdvertisement } from '../model/CarAdvertisement';
import { MongoCarAdvertisement } from '../model/mongo/MongoCarAdvertisement';
@Injectable({
  providedIn: 'root'
})

export class CarAdvertisementService {

  private apiUrl = 'http://localhost:5000/app';

  constructor(private http: HttpClient) { }

  addCarAdvertisement(carAdvertisement:CarAdvertisement) {
    const body = new URLSearchParams();
    body.set('carModel', carAdvertisement.carModel)
    body.set('engine', carAdvertisement.engine)
    body.set('mileage', carAdvertisement.mileage.toString())
    body.set('trimLevel', carAdvertisement.trimLevel)
    body.set('optionalService', carAdvertisement.optionalService ?? '');
    body.set('image', carAdvertisement.image)
    body.set('price', carAdvertisement.price.toString())

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    console.log(JSON.stringify(carAdvertisement, null, 2));

    return this.http.post('http://localhost:5000/app/addCarAdvertisement', body, {headers: headers});
  }

  getAll() {
    return this.http.get<MongoCarAdvertisement[]>('http://localhost:5000/app/getAllCarAdvertisements', {withCredentials: true});
  }

  update(carAdvertisement: MongoCarAdvertisement)  {
    const body = new URLSearchParams();
    body.set('_id', carAdvertisement._id)
    body.set('carModel', carAdvertisement.carModel)
    body.set('engine', carAdvertisement.engine)
    body.set('mileage', carAdvertisement.mileage.toString())
    body.set('trimLevel', carAdvertisement.trimLevel)
    body.set('optionalService', carAdvertisement.optionalService ?? '');
    body.set('image', carAdvertisement.image)
    body.set('price', carAdvertisement.price.toString())
    body.set('__v', carAdvertisement.__v.toString())

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.put<MongoCarAdvertisement>('http://localhost:5000/app/updateCarAdvertisement', body, {headers: headers});
  }

  delete(_id:string) {
    return this.http.delete('http://localhost:5000/app/deleteCarAdvertisement?id=' + _id, {withCredentials: true});
  }
}
