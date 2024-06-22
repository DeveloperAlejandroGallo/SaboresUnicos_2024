import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-tabs',
  templateUrl: './home-tabs.page.html',
  styleUrls: ['./home-tabs.page.scss'],
})
export class HomeTabsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  escanearQR(){
    console.log("escaneo de qr");
    
  }
}
