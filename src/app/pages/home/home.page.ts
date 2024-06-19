import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit{

  public usuario!: Usuario;
  public isLoading = false;

  constructor(private authSrv: AuthService) {

  }

  ngOnInit(): void {
    this.usuario = this.authSrv.usuarioActual!;
  }
}


