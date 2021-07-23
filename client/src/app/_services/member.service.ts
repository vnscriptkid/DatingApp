import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/Member';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl = `${environment.apiUrl}/users`;
  
  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<Member[]>(`${this.baseUrl}`);
  }

  getUser(username: string) {
    return this.http.get<Member>(`${this.baseUrl}/${username}`);
  }

  updateUser(member: Member) {
    return this.http.put(`${this.baseUrl}`, member);
  }
}
