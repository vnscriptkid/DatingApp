import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {map} from 'rxjs/operators';
import { User } from 'src/app/_models/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = `${environment.apiUrl}/account`;
  currentUserSource = new ReplaySubject<User | null>(1);
  currentUser$ = this.currentUserSource.asObservable();
  
  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post<User>(`${this.baseUrl}/login`, model)
      .pipe(
        map((user: User) => {
          if (user) this.setCurrentUser(user);
          return user;
        })
      );
  }

  register(model: any) {
    return this.http.post<User>(`${this.baseUrl}/register`, model)
      .pipe(
        map((user: User) => {
          if (user) this.setCurrentUser(user);
          return user;
        })
      )
  }

  checkUserInLocal() {
    const user = JSON.parse(String(localStorage.getItem('user')));
    if (user) this.setCurrentUser(user)
    else this.setCurrentUser(null)
  }

  private setCurrentUser(user: User) {
    this.currentUserSource.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem('user');
    this.setCurrentUser(null);
  }
}
