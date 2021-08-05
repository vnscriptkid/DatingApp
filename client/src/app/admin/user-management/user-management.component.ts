import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';
import { User } from 'src/app/_models/User';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  users: Partial<User[]> = [];
  bsModalRef: BsModalRef;
  
  constructor(private adminService: AdminService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.loadUsersWithRoles();
  }

  loadUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe(users => {
      this.users = users;
    });
  }

  openRolesModal(user: User) {
    const initialState = {
      user,
      roles: this.getRolesArray(user)
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, {initialState});
    this.bsModalRef.content.userRolesUpdated.subscribe((roles: Role[]) => {
      const rolesToUpdate = roles.filter(r => r.checked).map(r => r.value);

      this.adminService.updateUserRoles(user.userName, rolesToUpdate).subscribe(() => {
        user.roles = rolesToUpdate;
      })
    });
  }

  private getRolesArray(user: User): Role[] {
    return ['Member', 'Moderator', 'Admin'].map(role => ({
      name: role,
      value: role,
      checked: user.roles.includes(role)
    }));
  }
}

export interface Role {
  name: string;
  value: string;
  checked: boolean;
}
