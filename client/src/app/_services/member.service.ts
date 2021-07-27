import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/Member';
import { PaginatedResult, PaginationParams } from '../_models/Pagination';
import { Photo } from '../_models/Photo';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl = `${environment.apiUrl}/users`;

  members: Member[] = [];
  paginatedMembers: PaginatedResult<Member[]> = new PaginatedResult<Member[]>();
  
  constructor(private http: HttpClient) { }

  getUsers(query: PaginationParams = { itemsPerPage: 5, page: 1 }) {

    const params = {
      pageNumber: query.page,
      pageSize: query.itemsPerPage
    }

    return this.http.get<Member[]>(`${this.baseUrl}`, { observe: 'response', params }).pipe(
      map(response => {
        this.paginatedMembers.result = response.body;

        if (response.headers.get('Pagination') !== null) {
          this.paginatedMembers.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return this.paginatedMembers;
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

  setMainPhoto(photo: Photo) {
    return this.http.put(`${this.baseUrl}/set-main-photo/${photo.id}`, {});
  }

  deletePhoto(photo: Photo) {
    return this.http.delete(`${this.baseUrl}/delete-photo/${photo.id}`);
  }
}
