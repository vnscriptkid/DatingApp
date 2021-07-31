import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LikesParams } from '../_models/LikesParams';
import { Member } from '../_models/Member';
import { Photo } from '../_models/Photo';
import { User } from '../_models/User';
import { UserParams } from '../_models/UserParams';
import { AccountService } from './account.service';
import { getPaginatedResult } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  usersBaseUrl = `${environment.apiUrl}/users`;
  likesBaseUrl = `${environment.apiUrl}/likes`;

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

  // user params

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

  // users

  getUsers(params: UserParams) {
    this.userParams = params;
    
    const key = params.toString();
    if (this.memberCache.has(key)) return of(this.memberCache.get(key));
    
    return getPaginatedResult<Member[]>(this.usersBaseUrl, params, this.http)
      .pipe(map(response => {
        this.memberCache.set(key, response);
        
        return response;
      }));
  }

  getUser(username: string) {
    
    const member = [...this.memberCache.values()]
      .reduce((acc, ele) => acc.concat(ele.result), [])
      .find((m: Member) => m.username === username);

    if (member) return of(member);
    
    return this.http.get<Member>(`${this.usersBaseUrl}/${username}`);
  }

  updateUser(member: Member) {
    return this.http.put(`${this.usersBaseUrl}`, member)
      .pipe(
        map(() => {
          const index = this.members.findIndex(m => m.id === member.id);

          if (index !== -1) Object.assign(this.members[index], member);

          console.log(this.members);
        })
      );
  }

  // photos

  setMainPhoto(photo: Photo) {
    return this.http.put(`${this.usersBaseUrl}/set-main-photo/${photo.id}`, {});
  }

  deletePhoto(photo: Photo) {
    return this.http.delete(`${this.usersBaseUrl}/delete-photo/${photo.id}`);
  }

  // likes

  addLike(username: string) {
    return this.http.post(`${this.likesBaseUrl}/${username}`, {});
  }

  getLikes(likesParams: LikesParams) {
    return getPaginatedResult<Partial<Member>[]>(this.likesBaseUrl, likesParams, this.http);
  }
}
