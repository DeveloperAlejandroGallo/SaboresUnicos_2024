import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-animado',
  templateUrl: './splash-animado.page.html',
  styleUrls: ['./splash-animado.page.scss'],
})
export class SplashAnimadoPage {

  constructor(private router: Router) { }


  ionViewWillEnter() {
    setTimeout(()=>{
      this.router.navigateByUrl('/push-notification');
      //this.router.navigateByUrl('/login');
    }, 4000)
  }

}
