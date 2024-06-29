import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectChangeEventDetail } from '@ionic/angular';
import { IonSelectCustomEvent } from '@ionic/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // Declaraciones
  public correo: string = '';
  public clave: string = '';
  public mensaje: string = '';
  public loginForm!: FormGroup;
  public isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private usrSrv: UsuarioService
   ) {
      this.isLoading = false;
     }


  //Getters del Form
  get getEmailLogin() {
    return this.loginForm.get('emailLogin');
  }
  get getPasswordLogin() {
    return this.loginForm.get('passwordLogin');
  }


  ngOnInit(): void {
    this.loginForm = new FormGroup(
      {
        emailLogin: new FormControl('', [
          Validators.required,
          Validators.email,
        ]),
        passwordLogin: new FormControl('', [Validators.required])
      },
      Validators.required
    );
  }



  public onSubmitLogin(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      this.authService.iniciarSesion(this.getEmailLogin?.value, this.getPasswordLogin?.value);

    }, 2000);

  }



  public irARegistrar() {
    // this.usrSrv.actualizarCamposNuevos();
    this.loginForm.reset();
    this.router.navigate(['/signup/Cliente']);
  }

  ingresarComoInvitado(){
    this.loginForm.reset();
    this.router.navigate(['/signup/Anonimo']);
  }

  save(event: any): any {
    this.onSubmitLogin();
  }


  handleChange($event: IonSelectCustomEvent<SelectChangeEventDetail<any>>) {
    this.loginAutomatico($event.detail.value);
    }

  loginAutomatico(perfil: string) {
    switch (perfil) {
      case 'duenio':
        this.loginForm.setValue({
          emailLogin: 'administrador@yopmail.com', //Dueño
          passwordLogin: '111111',
        });
        break;
      case 'cliente':
        this.loginForm.setValue({
          emailLogin: 'invitado@yopmail.com', //Supervisor
          passwordLogin: '222222',
        });
        break;
      case 'maitre':
        this.loginForm.setValue({
          emailLogin: 'maitre@yopmail.com', //Maitre
          passwordLogin: '111111',
        });
        break;
      case 'mozo':
        this.loginForm.setValue({
          emailLogin: 'mozo@yopmail.com', //Mozo
          passwordLogin: '111111',
        });
        break;
      case 'cocinero':
        this.loginForm.setValue({
          emailLogin: 'cocinero1@yopmail.com', //Cocinero
          passwordLogin: '111111',
        });
        break;
      case 'barman':
        this.loginForm.setValue({
          emailLogin: 'bar1@yopmail.com', //Barman
          passwordLogin: '111111',
        });
        break;
    }
  }


}
