import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/Member';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl = `${environment.apiUrl}/users`;

  members: Member[] = [];
  
  constructor(private http: HttpClient) { }

  getUsers() {
    if (this.members.length) {
      return of(this.members);
    }
    return this.http.get<Member[]>(`${this.baseUrl}`).pipe(
      map(members => {
        this.members = members;

        return this.members;
      })
    );
  }

  getUser(username: string) {
    const member = this.members.find(m => m.username === username);

    if (member) return of(member);
    
    return this.http.get<Member>(`${this.baseUrl}/${username}`);
  }

  updateUser(member: Member) {
    return this.http.put(`${this.baseUrl}`, member)
      .pipe(
        map(() => {
          const index = this.members.findIndex(m => m.id === member.id);

          if (index !== -1) Object.assign(this.members[index], member);

          console.log(this.members);
        })
      );
  }
}
