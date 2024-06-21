import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-home-maitre',
  templateUrl: './home-maitre.page.html',
  styleUrls: ['./home-maitre.page.scss'],
})
export class HomeMaitrePage implements OnInit {

  listadoEnEspera = ["Juan", "Rocio", "Micaela"];

  public usuario!: Usuario;
  url: string;

  constructor(private router: Router, private auth: AuthService) {
    this.url = this.router.url;
    this.usuario = this.auth.usuarioActual!;
    console.log(this.usuario);
  }

  ngOnInit() {

    //aca con un get vamos a obtener la lista de espera
  }

}
