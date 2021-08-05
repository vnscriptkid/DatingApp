import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Member } from 'src/app/_models/Member';
import { Message } from 'src/app/_models/Message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {

  @ViewChild('msgForm') msgForm: NgForm;
  @Input() member: Member;
  msgContent = '';
  
  constructor(public messageService: MessageService) { }

  ngOnInit(): void {}

  myMessage(msg: Message) {
    return msg.senderId !== this.member.id;
  }

  sendMessage() {
    this.messageService.sendMessage(this.member.username, this.msgContent).then(() => {
      this.msgForm.reset();
    });
  }
}
