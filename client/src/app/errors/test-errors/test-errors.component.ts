import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.css']
})
export class TestErrorsComponent implements OnInit {

  baseUrl = 'https://localhost:5001/api/buggy'

  validationErrors: string[] = [];
  
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  get400Error() {
    this.http.get(`${this.baseUrl}/bad-request`)
      .subscribe(() => {}, (e) => console.error(e));
  }

  get401Error() {
    this.http.get(`${this.baseUrl}/auth`)
      .subscribe(() => {}, (e) => console.error(e));
  }

  get404Error() {
    this.http.get(`${this.baseUrl}/not-found`)
      .subscribe(() => {}, (e) => console.error(e));
  }

  get500Error() {
    this.http.get(`${this.baseUrl}/server-error`)
      .subscribe(() => {}, (e) => console.error(e));
  }

  getValidationError() {
    this.http.post('https://localhost:5001/api/account/register', {})
      .subscribe(() => {}, (e) => this.validationErrors = e);
  }  
}
