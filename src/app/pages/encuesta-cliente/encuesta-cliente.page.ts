import { Component, OnInit } from '@angular/core';
import { Encuesta } from 'src/app/models/encuesta';
import { Producto } from 'src/app/models/producto';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { EncuestaService } from 'src/app/services/encuesta.service';
import { Timestamp } from 'firebase/firestore';
import { TipoProducto } from 'src/app/enums/tipo-producto';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductoService } from 'src/app/services/producto.service';
import {
  Camera,
  CameraDirection,
  CameraResultType,
  CameraSource,
  ImageOptions,
  Photo,
} from '@capacitor/camera';
import {
  getDownloadURL,
  getStorage,
  ref,
  StringFormat,
  uploadBytes,
} from 'firebase/storage';
import { Router } from '@angular/router';
import { MensajesService } from 'src/app/services/mensajes.service';
import { formatDate } from '@angular/common';



@Component({
  selector: 'app-encuesta-cliente',
  templateUrl: './encuesta-cliente.page.html',
  styleUrls: ['./encuesta-cliente.page.scss'],
})
export class EncuestaClientePage implements OnInit {

  isLoading = false;
  public usuario: Usuario;
  public comentario!: string;
  public cantidadEstrellas: number = 0;
  public puntajeSaborDeLaComida: number = 1;
  public textoSaborDeLaComida: string = "Estaba muy fea ";
  public encuestaForm!: FormGroup;
  public cosasQueAgradaronElegidas!: Array<{ cosa: string; si: boolean }>
  public valorRecomendarLugar: any;
  public listaDeProductos: Array<Producto> = new Array<Producto>;
  public comidaFavorita!: Producto;
  public imageTomadaURL: string = '../../../assets/img/whoAmI.png';
  public imagenParaCargar!: { dataUrl: string; formato: string }; // Array de URL de imagenes para cargar
  listaDeCosas = [
    { cosa: 'Comida', si: false },
    { cosa: 'Tragos', si: false },
    { cosa: 'Atención', si: false },
    { cosa: 'Lugar', si: false },
    { cosa: 'Precio', si: false },
    { cosa: 'Otros', si: false }
  ];
  public selectedPhotos: Array<string> = new Array<string>;
  public fotosAMostrar: Array<string> = new Array<string>;
  public stars: string[] = [];
  public imagenSaborComida: string = '../../../assets/img/1.png';
  ngmensaje!: string;


  constructor(private encuestasSvc: EncuestaService, private auth: AuthService, private fb: FormBuilder,
    private productoService: ProductoService, private router: Router, private msjSrv: MensajesService) {
    this.usuario = this.auth.usuarioActual!;
    console.log(this.usuario);
    this.updateStarRating();
    this.LlenarListasDeProductos();
  }

  private LlenarListasDeProductos() {
    this.productoService.allProductos$.subscribe((productos) => {

      this.listaDeProductos = productos;
      console.log("Lista de productos: " + this.listaDeProductos);
    });
  }



  ngOnInit() {
    this.encuestaForm = this.fb.group({
      messageCtrl: [''],
      saborDeLaComida: [1],
      recomendariasElLugar: [],
      cosasAgradaron: [],
      mejorComida: [''],
    });
  }

  setStarRating(rating: number) {
    this.cantidadEstrellas = rating;
    this.updateStarRating();
    console.log("Cantidad las estrellas: " + this.cantidadEstrellas);

  }

  updateStarRating() {
    const starFull = '../../../assets/starFull.png';
    const starEmpty = '../../../assets/starEmpty.png';

    this.stars = Array(5).fill(starEmpty).map((_, index) => index < this.cantidadEstrellas ? starFull : starEmpty);
  }

  onRangeChange(event: any) {



    this.puntajeSaborDeLaComida = event.detail.value;
    if (this.puntajeSaborDeLaComida <= 2) {
      this.textoSaborDeLaComida = "Estaba muy fea ";
      this.imagenSaborComida = '../../../assets/img/1.png';

    } else if (this.puntajeSaborDeLaComida == 3) {
      this.textoSaborDeLaComida = "Estaba fea ";
      this.imagenSaborComida = '../../../assets/img/3.png';
    }
    else if (this.puntajeSaborDeLaComida > 3 && this.puntajeSaborDeLaComida <= 5) {
      this.textoSaborDeLaComida = "Estaba bien ";
      this.imagenSaborComida = '../../../assets/img/5.png';

    }
    else if (this.puntajeSaborDeLaComida >= 6 && this.puntajeSaborDeLaComida <= 7) {
      this.textoSaborDeLaComida = "Estaba rica ";
      this.imagenSaborComida = '../../../assets/img/7.png';

    } else {
      this.textoSaborDeLaComida = "Estaba muy rica ";
      this.imagenSaborComida = '../../../assets/img/10.png';
    }
    console.log('Puntaje abor de la Comida:', this.puntajeSaborDeLaComida);
  }

  getCheckBoxValuesChange() {
    let checkControls = this.listaDeCosas.filter(result => result.si == true);
    console.log('Cosas que le agradaron al cliente:', checkControls);
    this.cosasQueAgradaronElegidas = checkControls;
  }

  checkValorRecomendarLugar(event: any) {
    this.valorRecomendarLugar = event.detail.value;
    console.log(this.valorRecomendarLugar);

  }

  getSelectValuesChange() {
    this.comidaFavorita = this.encuestaForm.get('mejorComida')!.value;
    console.log(this.comidaFavorita);

  }

  tomarFoto() {

    if (this.selectedPhotos.length >= 3) {
      this.msjSrv.Info("Solo puedes tomar hasta 3 fotos.");
      return;
    }

    const options: ImageOptions = {
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      direction: CameraDirection.Rear,
    };

    Camera.getPhoto(options)
      .then((photo: Photo) => {
        if (photo.dataUrl) {
          this.selectedPhotos.push(photo.dataUrl);
          console.log(this.selectedPhotos);
        }
        else {
          this.msjSrv.Error("no se selecciono foto");

        }
        // this.imageTomadaURL = photo.dataUrl!; // La URL de la imagen capturada

        // if (photo.base64String !== 'No Image Selected') {
        //   this.imagenParaCargar = {
        //     dataUrl: photo.dataUrl!,
        //     formato: photo.format,
        //   };
        // } else {
        //   console.log('No se selecciono imagen');
        // }

        // this.selectedPhotos.push(this.imageTomadaURL);
        // console.log(this.selectedPhotos);


      })
      .catch((err) => {
        console.log(err);
        this.router.navigate([this.router.url]);
      });
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
  async enviarEncuesta() {

    try {
      if (!this.selectedPhotos || this.selectedPhotos.length === 0) {
        this.msjSrv.Error("No hay fotos seleccionadas, se necesita al menos 1.");
        return;
      }
      this.isLoading = true;
      const storage = getStorage();
      const photoUrls = await Promise.all(this.selectedPhotos.map(async (photoDataUrl, index) => {
        const photoBlob = this.dataURLtoBlob(photoDataUrl);
        const nombreCliente = this.usuario.nombre;
        const filePath = `fotos_encuestas/${nombreCliente}_${index + 1}.jpeg`;
        const storageRef = ref(storage, filePath);
        const snapshot = await uploadBytes(storageRef, photoBlob);
        return await getDownloadURL(snapshot.ref);
      }));

      const encuesta: Encuesta = {
        id: "",
        cliente: this.usuario,
        fecha: Timestamp.fromDate(new Date()),
        fotos: photoUrls,
        comentario: this.ngmensaje,
        cantidadEstrellas: this.cantidadEstrellas,
        SaborDeLaComida: this.puntajeSaborDeLaComida,
        RecomendariasElLugar: this.valorRecomendarLugar,
        QueCosasAgradaron: this.cosasQueAgradaronElegidas,
        MejorComida: this.comidaFavorita

      };

      await this.encuestasSvc.nuevo(encuesta);
      console.log("Encuesta Guardada");
      this.encuestasSvc.verLlenarEncuesta = false;
      this.encuestaForm.reset();
      this.selectedPhotos = [];
      this.cantidadEstrellas = 0;
      this.puntajeSaborDeLaComida = 0;
      this.isLoading = false;
      this.msjSrv.ExitoIonToast("¡Encuesta enviada con éxito!", 3);
      this.router.navigate(['/home-tabs/home']);     

    } catch (error) {
      console.log(error);
      this.msjSrv.Error("Error al enviar encuesta");
    }



    //   const mensaje: Mensaje = {
    //     id: "",
    //     mensaje: this.ngmensaje,
    //     //fecha: new Date(),
    //     fecha: Date.now(),
    //     nombreMozo: this.nombreMozo,
    //     numeroDeMesa: this.numeroMesaCliente,
    //     idDelEnviador: this.idUsuarioActual

    //   };

    //   this.chatSrv.nuevo(mensaje);


    //   if (this.nombreMozo == "") {
    //     this.pushService.notificarConsultaAMozos(this.numeroMesaCliente, this.ngmensaje).subscribe( {
    //       next: (data) => {
    //         console.log("Rta Push consulta del cliente: ");
    //         console.log(data);
    //       },
    //       error: (error) => {
    //         console.error("Error Push consulta del cliente: ");
    //         console.error(error);
    //       }
    //     });
    //   }
    //   this.ngmensaje = "";

  }

  formatearFecha(timestamp: any): string {
    const fecha = new Date(timestamp.seconds * 1000);
    return formatDate(fecha, 'HH:mm dd-MM-yyyy', 'en-US');
  }

}
