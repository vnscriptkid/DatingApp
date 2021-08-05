import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.css']
})
export class TestErrorsComponent implements OnInit {

  baseUrl = environment.apiUrl;

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
    this.http.post(`${this.baseUrl}/account/register`, {})
      .subscribe(() => {}, (e) => this.validationErrors = e);
  }  
}
