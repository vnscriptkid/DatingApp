import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelled = new EventEmitter();
  
  registerForm: FormGroup;
  
  constructor(private accountService: AccountService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    });
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      // @ts-ignore
      return control?.value === control?.parent?.controls[matchTo].value ? null : { isMatching: true };
    }
  }

  register() {
    this.accountService.register(this.registerForm.value)
      .subscribe(() => this.cancelled.emit())
  }

  cancel() {
    this.cancelled.emit();
  }
}
