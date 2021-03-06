import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/Member';
import { User } from 'src/app/_models/User';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  @HostListener('window:beforeunload', ['$event'])
  notifyUnsavedChangesIfAny($event: any) {
    if (this.editForm.dirty) $event.returnValue = true;
  }
  
  @ViewChild('editForm') editForm: NgForm;
  
  user: User;
  member: Member;
  
  constructor(
    private accountService: AccountService, 
    private memberService: MemberService, 
    private toastr: ToastrService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.loadMember();
  }


  private loadMember() {
    this.memberService.getUser(this.user.userName).subscribe(member => this.member = member);
  }

  updateInfo() {
    this.memberService.updateUser(this.member).subscribe(() => {
      this.toastr.success("User info has been updated")
      this.editForm.reset(this.member);
    })
  }
}
