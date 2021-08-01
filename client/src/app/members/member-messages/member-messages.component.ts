import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Member } from 'src/app/_models/Member';
import { Message } from 'src/app/_models/Message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {

  @ViewChild('msgForm') msgForm: NgForm;
  @Input() member: Member;
  @Input() messages: Message[];
  msgContent = '';
  
  constructor(private messageService: MessageService) { }

  ngOnInit(): void {}

  myMessage(msg: Message) {
    return msg.senderId !== this.member.id;
  }

  sendMessage() {
    this.messageService.sendMessage(this.member.username, this.msgContent).subscribe((msg) => {
      this.messages.push(msg);
      this.msgForm.reset();
    });
  }
}
