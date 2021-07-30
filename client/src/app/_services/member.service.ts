import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/Member';
import { PaginatedResult } from '../_models/Pagination';
import { Photo } from '../_models/Photo';
import { User } from '../_models/User';
import { UserParams } from '../_models/UserParams';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl = `${environment.apiUrl}/users`;

  members: Member[] = [];
  memberCache = new Map();
  userParams: UserParams;
  user: User;
  
  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(this.oppositeGender());
    })
  }

  getUsers(params: UserParams) {
    this.userParams = params;
    
    const key = params.toString();
    if (this.memberCache.has(key)) return of(this.memberCache.get(key));
    
    return this.getPaginatedResult<Member[]>(params)
      .pipe(map(response => {
        this.memberCache.set(key, response);
        
        return response;
      }));
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(userParams: UserParams) {
    this.userParams = userParams;
  }

  resetUserParams(): UserParams {
    this.userParams = new UserParams(this.oppositeGender());
    return this.userParams;
  }

  oppositeGender() {
    return UserParams.oppositeGender(this.user.gender)
  }

  private getPaginatedResult<T>(params: any) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    
    return this.http.get<T>(`${this.baseUrl}`, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body;

        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
      })
    );
  }

  getUser(username: string) {
    
    const member = [...this.memberCache.values()]
      .reduce((acc, ele) => acc.concat(ele.result), [])
      .find((m: Member) => m.username === username);

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
