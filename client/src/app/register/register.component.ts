import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelled = new EventEmitter();
  
  registerForm: FormGroup;
  
  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm() {
    this.registerForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
      passwordConfirm: new FormControl('')
    });
  }

  register() {
    this.accountService.register(this.registerForm.value)
      .subscribe(() => this.cancelled.emit())
  }

  cancel() {
    this.cancelled.emit();
  }
}
