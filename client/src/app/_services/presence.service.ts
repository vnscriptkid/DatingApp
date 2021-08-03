
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  hubUrl = `${environment.hubUrl}/presence`;

  private hubConnection: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);

  public onlineUsernames$ = this.onlineUsersSource.asObservable();

  constructor(private toastr: ToastrService, private router: Router) { }

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, { accessTokenFactory: () => user.token })
      .withAutomaticReconnect()
      .build()

    this.hubConnection
      .start()
      .catch(error => console.error(error));

    this.hubConnection.on('UserIsOnline', username => {
      this.toastr.info(username + ' has connected');
    })

    this.hubConnection.on('UserIsOffline', username => {
      this.toastr.warning(username + ' has disconnected');
    });

    this.hubConnection.on('GetOnlineUsers', (onlineUsernames: string[]) => {
      this.onlineUsersSource.next(onlineUsernames);
    });

    this.hubConnection.on('NewMessageReceived', ({ username, knownAs }) => {
      this.toastr.info(`${knownAs} has sent you a message`)
        .onTap
        .pipe(take(1))
        .subscribe(() => this.router.navigateByUrl(`/members/${username}?tab=3`));
    })
  }

  stopHubConnection() {
    this.hubConnection.stop().catch(error => console.error(error));
  }
}
