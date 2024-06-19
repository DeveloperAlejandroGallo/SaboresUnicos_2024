import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-maitre',
  templateUrl: './home-maitre.page.html',
  styleUrls: ['./home-maitre.page.scss'],
})
export class HomeMaitrePage implements OnInit {

  listadoEnEspera = ["Juan", "Rocio", "Micaela"];

  constructor() { }

  ngOnInit() {

    //aca con un get vamos a obtener la lista de espera
  }

}
