import { Component, OnInit } from '@angular/core';
import { LikesParams } from '../_models/LikesParams';
import { Member } from '../_models/Member';
import { Pagination } from '../_models/Pagination';
import { MemberService } from '../_services/member.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  members: Partial<Member>[];
  pagination: Pagination;
  likesParams: LikesParams = new LikesParams('liked', 1, 1);
  
  constructor(public memberService: MemberService) { }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.memberService.getLikes(this.likesParams).subscribe((paginatedResult) => {
      this.members = paginatedResult.result;
      this.pagination = paginatedResult.pagination;
    })
  }

  pageChanged(event: any) {
    this.likesParams.pageNumber = event.page;
    this.loadLikes();
  }
}
