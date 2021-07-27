import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/Member';
import { Pagination, PaginationParams } from 'src/app/_models/Pagination';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  pagination: Pagination;
  paginationParams: PaginationParams;

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
    this.paginationParams = {
      itemsPerPage: 5,
      page: 1
    }
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getUsers(this.paginationParams).subscribe((paginatedMembers) => {
      this.members = paginatedMembers.result;
      this.pagination = paginatedMembers.pagination;
    });
  }

  pageChanged(event: any) {
    this.paginationParams.page = event.page;
    this.loadMembers();
  }
}
