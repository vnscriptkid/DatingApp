import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/Message';
import { Pagination } from '../_models/Pagination';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages: Message[] = [];
  container = "Outbox";
  pagination: Pagination;
  
  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadMessages();
  }
  loadMessages() {
    this.messageService.getMessages(this.container).subscribe(paginatedResult => {
      this.messages = paginatedResult.result;
      this.pagination = paginatedResult.pagination;
    })
  }

}
