import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Role } from 'src/app/admin/user-management/user-management.component';
import { User } from 'src/app/_models/User';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {

  @Output() userRolesUpdated: EventEmitter<Role[]> = new EventEmitter();
  
  user: User;
  roles: Role[];
  
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  updateUserRoles() {
    this.userRolesUpdated.emit(this.roles);
    this.bsModalRef.hide();
  }  
}
