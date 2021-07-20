import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Input() usersFromHome: any;

  @Output() cancelled = new EventEmitter();
  
  model: any = {};
  
  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  register() {
    this.accountService.register(this.model)
      .subscribe(
        (user) => this.cancelled.emit(), 
        (error) => {
          console.error(error);
          if (typeof error.error === 'string') {
            this.toastr.error(error.error);
          } else if (error.error && error.error.errors) {
            Object.values(error.error.errors).forEach((errors: any) => {
              errors.forEach((error: any) => this.toastr.error(error))
            });
          }
        }
      )
  }

  cancel() {
    this.cancelled.emit();
  }
}
