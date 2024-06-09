import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ScanService } from 'src/app/services/scan.service';



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
    private scanService: ScanService,
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
    this.loginForm.reset();
    this.router.navigate(['/signup']);
  }

  save(event: any): any {
    this.onSubmitLogin();
  }

  public escanearDNI(){
    this.scanService.scan();
  }


  loginAutomatico(perfil: string) {
    switch (perfil) {
      case 'admin':
        this.loginForm.setValue({
          emailLogin: 'admin@admin.com',
          passwordLogin: '111111',
        });
        break;
      case 'invitado':
        this.loginForm.setValue({
          emailLogin: 'invitado@invitado.com',
          passwordLogin: '222222',
        });
        break;
      case 'usuario':
        this.loginForm.setValue({
          emailLogin: 'usuario@usuario.com',
          passwordLogin: '333333',
        });
        break;
      case 'anonimo':
        this.loginForm.setValue({
          emailLogin: 'anonimo@anonimo.com',
          passwordLogin: '444444',
        });
        break;
      case 'tester':
        this.loginForm.setValue({
          emailLogin: 'tester@tester.com',
          passwordLogin: '555555',
        });
        break;
    }
  }
  

}
