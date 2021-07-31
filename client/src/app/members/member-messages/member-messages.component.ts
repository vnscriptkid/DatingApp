import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/Member';
import { Message } from 'src/app/_models/Message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {

  @Input() member: Member;
  messages: Message[] = [];
  
  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadMessages();
  }
  loadMessages() {
    this.messageService.getMessageThread(this.member.username).subscribe(messages => {
      this.messages = messages;
    });
  }

}
