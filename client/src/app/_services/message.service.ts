import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/Message';
import { MessagesParams } from '../_models/MessagesParams';
import { getPaginatedResult } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  baseUrl = `${environment.apiUrl}/messages`;
  
  constructor(private http: HttpClient) { }

  getMessages(params: MessagesParams) {
    return getPaginatedResult<Message[]>(this.baseUrl, params, this.http);
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(`${this.baseUrl}/${username}`);
  }

  sendMessage(recipientUsername: string, content: string) {
    return this.http.post<Message>(`${this.baseUrl}`, { recipientUsername, content });
  }

  deleteMessage(messageId: number) {
    return this.http.delete(`${this.baseUrl}/${messageId}`);
  }

}
