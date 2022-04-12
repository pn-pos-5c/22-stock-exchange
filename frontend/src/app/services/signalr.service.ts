import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: HubConnection;
  messages: string[] = [];

  ngOnInit(): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5174/stock').build();

    this.hubConnection.on('test',
      (test: string) => this.messages.push(test));

    this.hubConnection.start()
      .then(() => this.messages.push('*** connection established'))
      .catch(err => this.messages.push('*** error while establishing connection'));
  }

  public get isConnected(): boolean {
    return this.hubConnection.state == HubConnectionState.Connected;
  }
}
