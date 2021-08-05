import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  title: string;
  message: string;
  okButton: string;
  cancelButton: string;
  result: boolean;

  constructor(public modalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  ok() {
    this.result = true;
    this.modalRef.hide();
  }
  
  cancel() {
    this.result = false;
    this.modalRef.hide();
  }

}
