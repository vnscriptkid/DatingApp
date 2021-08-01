import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/Message';
import { MessagesParams } from '../_models/MessagesParams';
import { Pagination } from '../_models/Pagination';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages: Message[] = [];
  pagination: Pagination;
  messagesParams: MessagesParams;
  loading = false;
  
  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.messagesParams = new MessagesParams("Outbox", 1);
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    this.messageService.getMessages(this.messagesParams).subscribe(paginatedResult => {
      this.loading = false;
      this.messages = paginatedResult.result;
      this.pagination = paginatedResult.pagination;
    })
  }

  pageChanged(event: any) {
    this.messagesParams.pageNumber = event.page;
    this.loadMessages();
  }

}
