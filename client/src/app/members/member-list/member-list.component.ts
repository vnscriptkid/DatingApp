import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/Member';
import { Pagination } from 'src/app/_models/Pagination';
import { User } from 'src/app/_models/User';
import { UserParams } from 'src/app/_models/UserParams';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  pagination: Pagination;
  userParams: UserParams;
  user: User;
  genderList = [{ value: 'male', label: 'Males' }, { value: 'female', label: 'Females' }];

  constructor(private memberService: MemberService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.loadUserParams();
  }

  loadUserParams() {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.resetFitlers();
      this.loadMembers();
    });
  }

  loadMembers() {
    this.memberService.getUsers(this.userParams).subscribe((paginatedMembers) => {
      this.members = paginatedMembers.result;
      this.pagination = paginatedMembers.pagination;
    });
  }

  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.loadMembers();
  }

  resetFitlers() {
    this.userParams = new UserParams(this.oppositeGender());
  }

  applyFilters() {
    this.loadMembers();
  }

  oppositeGender() {
    if (!this.user) return null;
    return this.user.gender === 'male' ? 'female' : 'male';
  }
}
