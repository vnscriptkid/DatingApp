import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/Member';
import { MemberService } from '../_services/member.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  predicate = 'liked';
  members: Partial<Member>[];
  
  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.memberService.getLikes(this.predicate).subscribe((members) => {
      this.members = members;
    })
  }
}
