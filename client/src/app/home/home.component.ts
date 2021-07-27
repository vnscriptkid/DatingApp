import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  registerMode = false;
  
  constructor(private http: HttpClient) { }

  toggleRegisterMode() {
    this.registerMode = !this.registerMode;
  }
}
