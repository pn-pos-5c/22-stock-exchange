import { Component } from '@angular/core';
import Share from "./models/share";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  clientCount = 0;
  cash = 0;
  username = '';
  shares: Share[] = [];
}
