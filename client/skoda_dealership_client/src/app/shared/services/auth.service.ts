import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:5000/app';

  login(email: string, password: string): Observable<any> {
    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post(`${this.apiUrl}/login`, body, {headers:headers, withCredentials: true }).pipe(
      catchError((error) => {
        let errorMessage = 'Something went wrong. Please try again.';
        if (error.status === 400 && error.error?.message) {
          errorMessage = error.error.message;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  register(user: User) {
    const body = new URLSearchParams();
    body.set('email', user.email);
    body.set('password', user.password);
    body.set('name', user.name);
    body.set('phoneNumber', user.phoneNumber);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post('http://localhost:5000/app/register', body, {headers: headers});
  }

  logout() {
    return this.http.post('http://localhost:5000/app/logout', {}, {withCredentials: true, responseType: 'text'});
  }

  checkAuth() {
    return this.http.get<boolean>('http://localhost:5000/app/checkAuth', {withCredentials: true});
  }
}