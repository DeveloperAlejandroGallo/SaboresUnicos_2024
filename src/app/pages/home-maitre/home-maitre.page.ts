import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-maitre',
  templateUrl: './home-maitre.page.html',
  styleUrls: ['./home-maitre.page.scss'],
})
export class HomeMaitrePage implements OnInit {

  listaUsuariosPendientes = ["Juan", "Rocio", "Micaela"];

  constructor() { }

  ngOnInit() {
  }

}
