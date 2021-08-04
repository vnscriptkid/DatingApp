import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Group } from '../_models/Group';
import { Message } from '../_models/Message';
import { MessagesParams } from '../_models/MessagesParams';
import { User } from '../_models/User';
import { getPaginatedResult } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  baseUrl = `${environment.apiUrl}/messages`;
  hubUrl = `${environment.hubUrl}/message`;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  private hubConnection: HubConnection;
  
  constructor(private http: HttpClient) { }

  getMessages(params: MessagesParams) {
    return getPaginatedResult<Message[]>(this.baseUrl, params, this.http);
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(`${this.baseUrl}/${username}`);
  }

  sendMessage(recipientUsername: string, content: string) {
    return this.hubConnection.invoke('SendMessage', {
      recipientUsername,
      content
    }).catch(error => console.error(error));
  }

  deleteMessage(messageId: number) {
    return this.http.delete(`${this.baseUrl}/${messageId}`);
  }

  createHubConnnection(user: User, otherUsername: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}?user=${otherUsername}`, { accessTokenFactory: () => user.token })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.error(error));

    this.hubConnection.on('ReceiveMessageThread', messages => {
      this.messageThreadSource.next(messages);
    });

    this.hubConnection.on('NewMessage', message => {
      this.messageThread$.pipe(take(1)).subscribe(messages => {
        this.messageThreadSource.next([ ...messages, message ]);
      })
    });

    this.hubConnection.on('GroupUpdated', (group: Group) => {
      if (group.connections.some(c => c.username === otherUsername)) {
        // otherUser have just joined the group, he'd see unseen msg if there's any!
        this.messageThread$.pipe(take(1)).subscribe(messages => {
          messages.forEach(m => {
            if (!m.dateRead) m.dateRead = new Date();
          })

          this.messageThreadSource.next(messages);
        });
      }
    }); 
  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop().catch(error => console.error(error));
    }
  }
}
