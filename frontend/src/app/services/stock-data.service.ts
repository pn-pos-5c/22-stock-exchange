import {Injectable} from '@angular/core';
import Transaction from "../models/Transaction";
import Depot from "../models/Depot";
import Share from "../models/share";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class StockDataService {
  connectedClients = 0;
  shares: Share[] = [];
  userCash = 0;
  userShares: Depot[] = [];
  transactions: Transaction[] = [];

  constructor(private http: HttpClient) {
    this.http.get<any>("http://localhost:5174/api/stock/getshares").subscribe(value => {
      this.shares = value;
    })
  }

  getUserCash(name: string) {
    return this.http.get<number>(`http://localhost:5174/api/stock/GetCash?name=${name}`);
  }

  getUserShares(name: string) {
    return this.http.get<any>(`http://localhost:5174/api/stock/GetDepots?name=${name}`);
  }
}
