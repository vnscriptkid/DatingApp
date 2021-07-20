import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  
  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

  register() {
    this.accountService.register(this.model)
      .subscribe((user) => this.cancelled.emit(), (error) => console.error(error))
  }

  cancel() {
    this.cancelled.emit();
  }
}
