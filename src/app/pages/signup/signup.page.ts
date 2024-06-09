import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { MensajesService } from 'src/app/services/mensajes.service';
import { ModalController, Platform } from '@ionic/angular';
import {
  getDownloadURL,
  getStorage,
  ref,
  StringFormat,
  uploadBytes,
} from 'firebase/storage';
import {
  Camera,
  CameraDirection,
  CameraResultType,
  CameraSource,
  ImageOptions,
  Photo,
} from '@capacitor/camera';
import { CustomValidators } from 'src/app/comun/CustomValidators';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ToastController } from '@ionic/angular'; // Importa ToastController
import { BarcodeFormat, BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { AudioService } from 'src/app/services/audio.service';
import { Haptics } from '@capacitor/haptics';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  public mensaje: string = '';
  public signupForm!: FormGroup;

  public imageTomadaURL: string = '../../../assets/img/whoAmI.png';
  public imagenParaCargar!: { dataUrl: string; formato: string }; // Array de URL de imagenes para cargar
  isLoading: boolean = false;
  isSupported: boolean = false;
  guardando: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private msgService: MensajesService,
    private usrSrv: UsuarioService,
    private toastController: ToastController,
    private platform: Platform,
    private audioSrv: AudioService,
    private modalController: ModalController
  ) {}

  //getters
  get getEmail() {
    return this.signupForm.get('email');
  }

  get getPassword() {
    return this.signupForm.get('password');
  }

  get getNombre() {
    return this.signupForm.get('nombre');
  }

  get getApellido() {
    return this.signupForm.get('apellido');
  }

  get getImagenPerfil() {
    return this.signupForm.get('imagenPerfil');
  }

  get getPasswordRep() {
    return this.signupForm.get('passwordRep');
  }

  get getEsAdmin() {
    return this.signupForm.get('esAdmin');
  }

  get getDni() {
    return this.signupForm.get('dni');
  }

  ngOnInit(): void {


    if (this.platform.is('capacitor')) {
      try {
        BarcodeScanner.installGoogleBarcodeScannerModule();

        BarcodeScanner.isSupported().then((result: any) => {
          this.isSupported = result.supported;
          if (!this.isSupported) {
            this.msgService.ErrorIonToast(
              'El escaneo de códigos QR no está soportado en este dispositivo'
            );
          }
        });

        BarcodeScanner.checkPermissions().then();
        BarcodeScanner.removeAllListeners();
      } catch (error) {
        console.error('Error al escanear: ' + error);
      }
    }else{
      console.warn('La funcionalidad de escaneo no está disponible en el navegador');
    }





    this.signupForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        nombre: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-zA-Z ]+$'), //solo letras y espacios
        ]),
        apellido: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-zA-Z ]+$'),
        ]),
        dni: new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.minLength(7),
          Validators.maxLength(9),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        passwordRep: new FormControl('', [Validators.required, CustomValidators.passwordIguales('password', 'passwordRep')]), //, CustomValidators.passwordIguales('password', 'passwordRep')
        esAdmin: new FormControl(false),
      },
      Validators.required
    );

    this.validateFields();

    this.mensaje = '';
  }

  validateFields(): void {
    Object.keys(this.signupForm.controls).forEach((field) => {
      const control = this.signupForm.get(field);
      control!.statusChanges.subscribe(async (value) => {
        if (control!.invalid && !this.guardando) {
          setTimeout(async () => {
            // Necesario para esperar a que se actualice el estado de validación
            const errors = control!.errors;
            if (errors) {
              console.log(`${field} has errors: `, errors);
              let msg: string = '';
              switch (field) {
                case 'email':
                  if (errors['required']) {
                    msg += 'Email es requerido';
                  }
                  if (errors['email']) {
                    msg += 'Email no es válido';
                  }
                  break;
                case 'nombre':
                  if (errors['required']) {
                    msg += 'Nombre es requerido';
                  }
                  if (errors['pattern']) {
                    msg +=
                      'Nombre no es válido, deben ser solo letras o espacio';
                  }
                  break;
                case 'apellido':
                  if (errors['required']) {
                    msg += 'Apellido es requerido';
                  }
                  if (errors['pattern']) {
                    msg += 'Apellido no es válido, deben ser letras o espacio';
                  }
                  break;
                case 'dni':
                  if (errors['required']) {
                    msg += 'DNI es requerido';
                  }
                  if (errors['pattern']) {
                    msg += 'DNI no es válido, deben ser solo números';
                  }
                  if (errors['minlength']) {
                    msg += `Faltan ingresar ${
                      errors['minlength'].requiredLength -
                      errors['minlength'].actualLength
                    } caracteres`;
                  }
                  if (errors['maxlength']) {
                    msg += `Se ingresaron ${
                      errors['maxlength'].actualLength -
                      errors['maxlength'].requiredLength
                    } caracteres de más`;
                  }
                  break;

                case 'password':
                  if (errors['required']) {
                    msg += 'Contraseña es requerida';
                  }
                  if (errors['minlength']) {
                    msg += `Faltan ingresar al menos ${
                      errors['minlength'].requiredLength -
                      errors['minlength'].actualLength
                    } caracteres mas`;
                  }
                  break;
                // case 'passwordRep':
                //   if (errors['required']) {
                //     msg += 'Repetir contraseña es requerido';
                //   }
                //   if (errors['passwordIguales']) {
                //     msg += 'Las contraseñas no coinciden';
                //   }
                //   break;
                default:
                  break;
              }

              if (msg !== '') await this.msgService.ErrorIonToast(msg); // Muestra el toast con el mensaje de error
            } else if(!this.guardando){
              await this.msgService.ExitoIonToast(`${this.capitalizarPrimeraLetra(field)} válido`,1);
            }
          }, 0); // Ejecutar después de la próxima iteración del ciclo de eventos
        }else if(!this.guardando) {
          await this.msgService.ExitoIonToast(`${this.capitalizarPrimeraLetra(field)} válido`, 1);
        }
      });
    });
  }


  capitalizarPrimeraLetra(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }



  onSubmitSignup() {
    this.guardando = true;
    this.isLoading = true;
    console.log('Formulario de registro enviado');
    this.createUserFireBase();
  }

  save($event: Event) {
    this.onSubmitSignup();
  }

  async createUserFireBase() {
    if (this.imageTomadaURL === '../../../assets/img/whoAmI.png') {
      Haptics.vibrate({ duration: 500 });
      this.msgService.ErrorIonToast('Tome una foto para imagen de perfil');
      return;
    }

    const data = this.imagenParaCargar;

    if (this.getPassword?.value != this.getPasswordRep?.value) {
      Haptics.vibrate({ duration: 500 });
      this.msgService.ErrorIonToast('Las contraseñas son distintas ');
      return;
    }

    if (this.usrSrv.existeUsuario(this.getEmail?.value)) {
      Haptics.vibrate({ duration: 500 });
      this.msgService.ErrorIonToast('El email ya se encuentra registrado');
      return;
    }

    const urlImage = await this.uploadImage(
      this.dataURLtoBlob(data.dataUrl),
      data.formato,
      this.getEmail?.value
    );


    var usuario: Usuario = {
      id: '',
      nombre: this.getNombre?.value,
      apellido: this.getApellido?.value,
      email: this.getEmail?.value,
      clave: this.getPassword?.value,
      esAdmin: this.getEsAdmin?.value,
      dni: this.getDni?.value,
      foto: urlImage,
    };

    this.authService.registrarCuenta(usuario);
    setTimeout(() => {
      this.isLoading = false;
      this.audioSrv.reporoduccionSuccess();
      this.msgService.ExitoIonToast('Registro exitoso', 2);
      this.imageTomadaURL = '../../../assets/img/whoAmI.png';
      this.signupForm.reset();
      this.guardando = false;
    }, 2000);

  }

  dataURLtoBlob(dataUrl: string) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }

  async uploadImage(blob: any, formato: any, nombre: string) {
    try {
      const storage = getStorage();
      const filePath = `images/${nombre}.${formato}`;
      const fileRef = ref(storage, filePath);
      const upload = await uploadBytes(fileRef, blob);
      console.log('Imagen subida correctamente', upload);
      const url = getDownloadURL(fileRef);
      return url;
    } catch (error) {
      console.log(error);
    }
    return '';
  }

  tomarFoto() {
    const options: ImageOptions = {
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      direction: CameraDirection.Rear,
    };

    Camera.getPhoto(options)
      .then((photo: Photo) => {
        this.imageTomadaURL = photo.dataUrl!; // La URL de la imagen capturada

        if (photo.base64String !== 'No Image Selected') {
          this.imagenParaCargar = {
            dataUrl: photo.dataUrl!,
            formato: photo.format,
          };
        } else {
          console.log('No se selecciono imagen');
        }
      })
      .catch((err) => {
        console.log(err);
        this.router.navigate([this.router.url]);
      });
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async scanQR() {
    try {
      BarcodeScanner.installGoogleBarcodeScannerModule();
      console.log('Escaneando código QR...');

      // Configura el escaneador para que solo reconozca códigos QR
      const granted = await this.requestPermissions();
      if (!granted) {
        this.msgService.ErrorIonToast(
          'No se han otorgado los permisos para acceder a la cámara'
        );
        return;
      }
      const result = await BarcodeScanner.scan({
        formats: [BarcodeFormat.Pdf417], // Solo apunta a documentos de identidad
      }); // Add type assertion to specify 'targetedFormats' property
      console.log(result);

      if (result.barcodes.length === 0) {
        Haptics.vibrate({ duration: 500 });
        this.msgService.ErrorIonToast('No se ha podido leer el código de barras');
        return;
      }

      const datosDni = result.barcodes[0].displayValue;

      const arrayDatos = datosDni.split('@');

      console.log("Datos" + arrayDatos);


        setTimeout(() => {

          this.isLoading = false;
        }, 2000);
      }catch (error) {
        console.error('Error al escanear: ' + error);
      }

    }



    async startScan() {
      try {
        const modal = await this.modalController.create({
          component: BarcodeScanningModalComponent,
          cssClass: 'barcode-scanning-modal',
          showBackdrop: false,
          componentProps: {
            formats: [],
            LensFacing: LensFacing.Back,
          },
        });

        await modal.present();

        const { data } = await modal.onWillDismiss();

        if (data) {
          console.log('Datita QR:' + data.barcode.displayValue);

          const datosDni = data?.barcode?.displayValue;

          const arrayDatos = datosDni.split('@');

          console.log('Datos' + arrayDatos);
        }
      } catch (error) {
        console.error('Error al escanear: ' + error);
      }
    }


}
