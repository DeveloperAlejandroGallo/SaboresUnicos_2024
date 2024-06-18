import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
import {
  BarcodeFormat,
  BarcodeScanner,
  LensFacing,
} from '@capacitor-mlkit/barcode-scanning';
import { AudioService } from 'src/app/services/audio.service';
import { Haptics } from '@capacitor/haptics';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { Perfil } from 'src/app/enums/perfil';

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
  public isLoading: boolean = false;
  public isSupported: boolean = false;
  public guardando: boolean = false;
  public isPermissionGranted = false;
  public verApellido:  boolean = false;
  public verDni:  boolean = false;
  public verPassword:  boolean = false;
  public verCuil:  boolean = false;
  public verEmail:  boolean = false;
  public tituloBoton:  string = "Registrarse";
  public verScanner:  boolean = false;
  private perfil: Perfil;

  constructor(
    private authService: AuthService,
    private router: Router,
    private msgService: MensajesService,
    private usrSrv: UsuarioService,
    private toastController: ToastController,
    private platform: Platform,
    private audioSrv: AudioService,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private usrService: UsuarioService
  ) {
    this.perfil = this.route.snapshot.paramMap.get('perfil') as Perfil;

    switch (this.perfil) {
      case Perfil.Cliente:
        this.verApellido = true;
        this.verDni = true;
        this.verEmail = true;
        this.verPassword = true;
        this.verCuil = false;
        this.tituloBoton = 'Registrarse';
        break;
      case Perfil.Anónimo:
        this.verApellido = false;
        this.verDni = false;
        this.verEmail = false;
        this.verPassword = false;
        this.verCuil = false;
        this.tituloBoton = 'Ingresar';
        break;
    }
  }

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

  get getDni() {
    return this.signupForm.get('dni');
  }

  get getCuil() {
    return this.signupForm.get('cuil');
  }

  ngOnInit(): void {

    if (this.platform.is('capacitor') && this.perfil != Perfil.Anónimo) {
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

        BarcodeScanner.checkPermissions().then((result) => {
          this.isPermissionGranted = result.camera === 'granted';
        });
        BarcodeScanner.removeAllListeners();
      } catch (error) {
        console.error('Error al escanear: ' + error);
      }
    } else {
      console.warn(
        'La funcionalidad de escaneo no está disponible en el navegador'
      );
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
        cuil: new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.minLength(10),
          Validators.maxLength(12),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
      },
      Validators.required
    );

    this.mensaje = '';
  }


  onSubmitSignup() {
    this.guardando = true;
    this.isLoading = true;
    console.log('Formulario de registro enviado');
    if (this.perfil == Perfil.Anónimo)
      this.createUserAnonimo();
    else
      this.createUserRegistrado();
  }

  save($event: Event) {
    this.onSubmitSignup();
  }

  async createUserRegistrado() {
    try {

      if(!this.camposSonValidos())
        return;

      const data = this.imagenParaCargar;


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

        dni: this.getDni?.value,
        foto: urlImage,
        cuil: '',
        perfil: Perfil.Cliente,
        tipoEmpleado: undefined,
        activo: false,
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
    } catch (error) {
      console.log(error);
      this.guardando = this.isLoading = false;
    }
  }

  async createUserAnonimo() {
    try {

      if(!this.camposSonValidos())
        return;

      const data = this.imagenParaCargar;

      const urlImage = await this.uploadImage(
        this.dataURLtoBlob(data.dataUrl),
        data.formato,
        this.getEmail?.value
      );

      var usuario: Usuario = {
        id: '',
        nombre: this.getNombre?.value,
        apellido: '',
        email: '',
        clave: '',

        dni: 0,
        foto: urlImage,
        cuil: '',
        perfil: Perfil.Anónimo,
        tipoEmpleado: null,
        activo: true,
      };

      this.authService.usuarioActual = this.usrService.nuevo(usuario);

      setTimeout(() => {
        this.isLoading = false;
        this.audioSrv.reporoduccionSuccess();
        this.imageTomadaURL = '../../../assets/img/whoAmI.png';
        this.signupForm.reset();
        this.guardando = false;
        this.router.navigate(['/home']);
        this.msgService.ExitoIonToast('Bienvenid@ a Sabores Únicos!', 3);
      }, 2000);
    } catch (error) {
      console.log(error);
      this.guardando = this.isLoading = false;
    }
  }
  camposSonValidos():boolean {
    if (this.imageTomadaURL === '../../../assets/img/whoAmI.png') {
      this.mostrarError('Tome una foto para imagen de perfil');
      return false;
    }

    //validar nombre
    if (this.getNombre?.value === '') {
      this.mostrarError('Ingrese un nombre válido');
      return false;
    }

    if(this.perfil == Perfil.Anónimo){
      return true;
    }


    //validar apellido
    if (this.verApellido && this.getApellido?.value === '') {
      this.mostrarError('Ingrese un apellido válido');
      return false;
    }


    if (this.verEmail && this.usrSrv.existeUsuario(this.getEmail?.value)) {
      this.mostrarError('El email ya se encuentra registrado');
      return false;
    }

    //validar dni
    if (this.verDni && (this.getDni?.value === '' || this.getDni?.value.length < 7 || this.getDni?.value.length > 9)) {
      this.mostrarError('Ingrese un DNI válido');
      return false;
    }
    //validar cuil
    if (this.verCuil && (this.getCuil?.value === '' || this.getCuil?.value.length < 10 || this.getCuil?.value.length > 12)) {
      this.mostrarError('Ingrese un CUIL válido');
      return false;
    }

    //validar password
    if (this.verPassword && (this.getPassword?.value === '' || this.getPassword?.value.length < 6)) {
      this.mostrarError('Ingrese una contraseña válida');
      return false;
    }

    return true;
  }

  mostrarError(msg: string){
    Haptics.vibrate({ duration: 500 });
    this.msgService.ErrorIonToast(msg);
    this.guardando = this.isLoading = false;
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
        this.msgService.ErrorIonToast(
          'No se ha podido leer el código de barras'
        );
        return;
      }

      const datosDni = result.barcodes[0].displayValue;

      const dni = datosDni.split('@');

      if (dni.length == 8 || dni.length == 9) {
        this.signupForm.patchValue({ apellido: dni[1] });
        this.signupForm.patchValue({ nombre: dni[2] });
        //this.signupForm.setValue({sexo: dni[3] == 'M' ? 'Masculino' : 'Femenino' });
        this.signupForm.patchValue({ dni: dni[4] });
        //this.signupForm.setValue({dni: dni[8] != null ? dni[8].substr(0, 2) + dni[4] + dni[8].substr(-1) : this.calcularCUIT()});
      } else {
        this.signupForm.patchValue({ apellido: dni[4] });
        this.signupForm.patchValue({ nombre: dni[5] });
        this.signupForm.patchValue({ dni: dni[1] });
        //this.signupForm.setValue({sexo: dni[8] == 'M' ? 'Masculino' : 'Femenino' });
        //this.signupForm.setValue({cuil: this.calcularCUIT()});
      }
    } catch (error) {
      console.error('Error al escanear: ' + error);
    }
  }

  // calcularCUIT(): string {
  //   let dni = this.getDni;
  //   let cuit: Array<number> = [];
  //   let cantCeros = 8 - dni!.length;
  //   let result: string;
  //   cuit[0] = 2;
  //   //cuit[1] = this.sexo === 'Masculino' ? 0 : 7;
  //   for (let i = 0; i < cantCeros; i++)
  //     cuit.push(0);

  //   for (let i = 0; i < dni.length; i++) {
  //     if (Number.parseInt(dni[i]) != NaN)
  //       cuit.push(Number.parseInt(dni[i]));
  //   }
  //   let tot: number = 0;
  //   tot += cuit[0] * 5;
  //   tot += cuit[1] * 4;
  //   tot += cuit[2] * 3;
  //   tot += cuit[3] * 2;
  //   tot += cuit[4] * 7;
  //   tot += cuit[5] * 6;
  //   tot += cuit[6] * 5;
  //   tot += cuit[7] * 4;
  //   tot += cuit[8] * 3;
  //   tot += cuit[9] * 2;

  //   let digVer: number;

  //   switch (tot % 11) {
  //     case 0:
  //       digVer = 0;
  //       break;
  //     case 1:
  //       digVer = cuit[1] == 0 ? 9 : 4;
  //       cuit[1] = 3;
  //       break;
  //     default:
  //       digVer = 11 - (tot % 11);
  //       break;
  //   }
  //   cuit[10] = digVer;
  //   let ret: string = cuit.join('');

  //   return ret.substring(0, 11);
  // }

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

  volver() {
    this.router.navigate(['/login']);
  }
}
