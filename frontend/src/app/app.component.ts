import {Component, Input, ViewChild} from '@angular/core';
import {SignalrService} from "./services/signalr.service";
import {StockDataService} from "./services/stock-data.service";
import {BaseChartDirective} from "ng2-charts";
import {ChartConfiguration, ChartType} from "chart.js";
import {Observable} from "rxjs";
import Share from "./models/share";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  username = '';
  selectedShare = '';
  newStockData: Observable<Share[]>;
  currentStockData: Share[] = [];

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [],
  };

  constructor(public signalr: SignalrService, public data: StockDataService) {
    this.newStockData = signalr.onNewStocks();

    this.newStockData.subscribe(x => {
        this.currentStockData = x;
        this.selectedShare = x[0].name;

      let index = 0;
      this.chartData.labels?.push(new Date().toLocaleString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false}));
      this.currentStockData.slice(0, 5).forEach(x => {
        console.log(x);
        if (this.chartData.datasets[index]) {
          this.chartData.datasets[index].data.push(x.val);
        } else {
          this.chartData.datasets[index] = {
            label: x.name,
            data: [x.val],
          }
        }
        index++;
      });

      this.chart?.update();
    });
  }

  userNameChanged(event: Event) {
    //@ts-ignore
    this.username = event.target?.value;

    this.loadUserData();
  }

  loadUserData() {
    if (this.username.length < 1) return;

    this.data.getUserCash(this.username).subscribe(resolve => {
      this.data.userCash = resolve;
    });

    this.data.getUserShares(this.username).subscribe(resolve => {
      this.data.userShares = resolve;
    });
  }

  addTransaction(amount: number, isBuy: boolean) {
    this.signalr.newTransaction(this.username, this.selectedShare, isBuy, amount).then(() => this.loadUserData());
  }


}
