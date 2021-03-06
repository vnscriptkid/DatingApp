import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {map} from 'rxjs/operators';
import { User } from 'src/app/_models/User';
import { environment } from 'src/environments/environment';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = `${environment.apiUrl}/account`;
  private currentUserSource = new ReplaySubject<User | null>(1);
  currentUser$ = this.currentUserSource.asObservable();
  
  constructor(private http: HttpClient, private presenceService: PresenceService) { }

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

  setCurrentUser(user: User) {
    if (user) {
      // populate user with roles from token
      user.roles = [];
      const roles = this.getDecodedToken(user.token).role;
      Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
      // register him with presence hub
      this.presenceService.createHubConnection(user);
    } else {
      this.presenceService.stopHubConnection();
    }
    
    this.currentUserSource.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem('user');
    this.setCurrentUser(null);
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
