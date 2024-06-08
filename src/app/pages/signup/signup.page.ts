import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { MensajesService } from 'src/app/services/mensajes.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {


  public mensaje: string = '';
  public signupForm!: FormGroup;



  constructor(
    private authService: AuthService,
    private router: Router,
    private msgService: MensajesService) { }



  //getters
  get getEmail() {
    return this.signupForm.get('emailSignup');
  }

  get getPassword() {
    return this.signupForm.get('passwordSignup');
  }

  get getNombre() {
    return this.signupForm.get('nombreSignup');
  }

  get getApellido() {
    return this.signupForm.get('apellidoSignup');
  }



  ngOnInit(): void {
    this.signupForm = new FormGroup({
        emailSignup: new FormControl('', [
          Validators.required,
          Validators.email,
        ]),
        passwordSignup: new FormControl('', [
          Validators.required,
          Validators.min(6),
        ]),
        nombreSignup: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-zA-Z ]+$'), //solo letras y espacios


        ]),
        apellidoSignup: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-zA-Z]+$'),
        ]),
        esAdminSignup: new FormControl(false),
      },
      Validators.required
    );

    this.mensaje = '';
  }

  public irALogin() {

    this.signupForm.reset();

    this.router.navigate(['/login']);
  }

  onSubmitSignup() {
    this.createUserFireBase();
  }


  save($event: Event) {
    this.onSubmitSignup();
  }



  private createUserFireBase() {

    var usuario: Usuario = {
      id: '',
      nombre: this.getNombre?.value,
      apellido: this.getApellido?.value,
      email: this.getEmail?.value,
      clave: this.getPassword?.value
    };

    this.authService.registrarCuenta(usuario);

    this.msgService.Exito('Registro exitoso');
    this.router.navigate(['/login']);


  }
}
