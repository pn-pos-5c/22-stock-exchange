import {Injectable} from '@angular/core';
import {HubConnection, HubConnectionBuilder, HubConnectionState} from "@microsoft/signalr";
import {StockDataService} from "./stock-data.service";
import {Observable, Subject} from "rxjs";
import Share from "../models/share";

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection: HubConnection;
  messages: string[] = [];
  private subject = new Subject<Share[]>();

  constructor(private dataService: StockDataService) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5174/stock').build();

    this.hubConnection.on('ClientCountChanged', (clients) => {
      this.dataService.connectedClients = clients;
      this.messages.push(`*** new client count: ${clients}`);
    });

    this.hubConnection.on('transactionReceived', (transaction) => {
      this.dataService.transactions.push(transaction);
      this.messages.push('*** new transaction added');
    });
  }

  public connect(): void {
    this.hubConnection.start()
      .then(() => this.messages.push('*** connection established'))
      .catch(err => this.messages.push('*** error while establishing connection'));
  }

  public disconnect(): void {
    this.hubConnection.stop()
      .then(() => this.messages.push('*** disconnected'))
      .catch(err => this.messages.push('*** error disconnecting'));
  }

  public get isConnected(): boolean {
    return this.hubConnection.state == HubConnectionState.Connected;
  }

  newTransaction(username: string, selectedShare: string, isBuy: boolean, value: number) {
    this.messages.push(`*** ${username} bought ${value}x ${selectedShare}`);
    return this.hubConnection.send('BuyShare', username, selectedShare, value, isBuy);
  }

  public onNewStocks(): Observable<Share[]> {
    this.hubConnection.on('newStocks', (val) => this.subject.next(val))
    return this.subject.asObservable();
  }
}
