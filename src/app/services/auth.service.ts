import { Injectable } from '@angular/core';
import { getAuth, sendEmailVerification,createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, onAuthStateChanged  } from "firebase/auth";
import { UsuarioService } from './usuario.service';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario';
import { MensajesService } from './mensajes.service';
import { usuarioLocalStorage } from '../models/constantes';
import { AudioService } from './audio.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  sesionActiva: boolean = false;
  redirectUrl?: string;
  public usuarioActual?: Usuario;

  constructor(private usrService: UsuarioService,
              private messageService: MensajesService,
              private router: Router,
            private audioSrv: AudioService) { }




  public iniciarSesion(email:string, password: string) {

    let i: number = 0;
    const auth = getAuth();

    if(!this.usrService.existeUsuario(email)){
      this.messageService.Warning("El usuario no existe en la base. \nPor favor registrese.");
      return;
    }

    this.usuarioActual = this.usrService.listadoUsuarios?.find(x => x.email == email)!;

    console.log(this.usuarioActual)

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in

        if(!userCredential.user.emailVerified){
         this.messageService.Warning("Para ingresar, debe validar su email.");
        //  this.cerrarSesion();
         return;
        }

        // this.messageService.InfoToast("Bienvenido " + email);
        this.router.navigate(['/home-tabs']);


    })
    .catch((error) => {
      let msg: string="";
      switch (error.code) {
        case 'auth/invalid-email':
          msg = 'Correo con formato incorrecto';
          break;
        case 'auth/invalid-credential':
          msg = 'Usuario o Clave incorrecto';
          break;
        case 'auth/user-not-found':
          msg = 'El usuario no existe.';
          // this.register();
          break;
        default:
          msg = error.message;
      }
      this.messageService.Error(`Usuario: ${email} - ${msg}`);
    });
  }


  loguear(usr: Usuario) {
    this.sesionActiva = true;
    localStorage.setItem(usuarioLocalStorage, JSON.stringify(usr));
    //Registro el ingreso:



  }

  public registrarCuenta(usuario: Usuario) {


    const auth = getAuth();

    createUserWithEmailAndPassword(auth,usuario.email, usuario.clave)
    .then((userCredential) => {
      //Lo guardo en la coleccion:

      this.usrService.nuevo(usuario);

      sendEmailVerification(auth.currentUser!);
      this.messageService.Exito(`Usuario ${usuario.email} registrado correctamente. \nSe ha enviado un correo de verificación`);

      // setTimeout(() => {
      //   this.router.navigate(['/login']);
      // }, 1500);

    })
    .catch((error) => {
      let msg: string = "";
      switch (error.code) {
        case 'auth/weak-password':
          msg = 'La clave debe poseer al menos 6 caracteres';
          break;
        case 'auth/email-already-in-use':
          msg = 'Correo ya registrado';
          break;
        case 'auth/invalid-email':
          msg = 'Correo con formato inv\u00E1lido';
          break;
        case 'auth/argument-error':
          if (error.message == 'createUserWithEmailAndPassword failed: First argument "email" must be a valid string.')
            msg = 'Correo con debe ser una cadena v\u00E1lida';
          else
            msg = 'La constrase\u00F1a debe ser una cadena v\u00E1lida';
          break;
        case 'auth/argument-error':
          msg = 'Correo con debe ser una cadena v\u00E1lida';
          break;
        default:
          msg = 'Error en registro';
      }
      this.messageService.Error(`Usuario: ${usuario.email} - ${msg}`);
      throw error;
    });
  }



  public cerrarSesion() {

    const auth = getAuth();

    signOut(auth).then(() => {
      localStorage.removeItem(usuarioLocalStorage);
      this.audioSrv.reporoduccionLogOut();
      this.messageService.InfoToast('Sesión cerrada');
      this.router.navigate(['/login']);
    }).catch((error) => {
      this.messageService.Error('Ocurrió un error al cerrar sesión');
      console.log(error);
    });
  }

  public currentUser() {

    const usr = localStorage.getItem(usuarioLocalStorage);

    return usr ? JSON.parse(usr) : null;
  }

  public logueado() {
    const auth = getAuth();

    return (auth.currentUser != null) && (this.usuarioActual!.email == auth.currentUser.email);


  }

  // public logInfo():Usuario | undefined{
  //   let user: Usuario | undefined;
  //   const auth = getAuth();
  //   if(auth.currentUser){
  //     this.usuarioActual = this.usrService.listadoUsuarios?.find(x => x.email == auth.currentUser!.email);
  //     if(this.usuarioActual)
  //     {
  //       user = this.usuarioActual;
  //     }
  //   }
  //   return user;
  // }

  traeUsuarioLogueado() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        this.usuarioActual = this.usrService.listadoUsuarios?.find(x => x.email == user.email);
        this.sesionActiva = true;
        // ...
      } else {
        this.sesionActiva = false;
      }
    });
  }


}
