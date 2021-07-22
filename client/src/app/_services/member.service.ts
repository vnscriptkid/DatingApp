import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/Member';

const httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + JSON.parse(String(localStorage.getItem('user')))?.token
    })
};

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl = `${environment.apiUrl}/users`;
  
  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<Member[]>(`${this.baseUrl}`, httpOptions);
  }

  getUser(username: string) {
    return this.http.get<Member>(`${this.baseUrl}/${username}`, httpOptions);
  }
}
