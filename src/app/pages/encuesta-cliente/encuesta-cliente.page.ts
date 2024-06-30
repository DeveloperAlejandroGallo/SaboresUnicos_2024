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
import { Router } from '@angular/router';
import { MensajesService } from 'src/app/services/mensajes.service';

@Component({
  selector: 'app-encuesta-cliente',
  templateUrl: './encuesta-cliente.page.html',
  styleUrls: ['./encuesta-cliente.page.scss'],
})
export class EncuestaClientePage implements OnInit {

  isLoading = true;
  public usuario: Usuario;
  public comentario!: string;
  public cantidadEstrellas: number = 0;
  public puntajeSaborDeLaComida: number = 1;
  public textoSaborDeLaComida: string = "Estaba muy fea :(";
  public recomendariasElLugar!: boolean;
  public encuestaForm!: FormGroup;
  public cosasQueAgradaronElegidas: string [] = [];
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
  MejorComida: any;
  public selectedPhotos: Array<string> = new Array<string>;
  public stars: string[] = [];

  constructor(private encuestasSvc : EncuestaService, private auth: AuthService, private fb:FormBuilder,  
    private productoService: ProductoService,private router: Router,private msjSrv: MensajesService) { 
    this.usuario = this.auth.usuarioActual!;
    console.log(this.usuario); 
    this.updateStarRating();
    this.LlenarListasDeProductos();
  }

  private LlenarListasDeProductos() {
    this.productoService.allProductos$.subscribe((productos) => {

      this.listaDeProductos = productos;
      console.log("Lista de productos: "+ this.listaDeProductos);
    });
  }

  

  ngOnInit() {
    this.encuestaForm = this.fb.group({
      messageCtrl:[''],
      saborDeLaComida: [1],
      recomendariasElLugar:[],
      cosasAgradaron:[],
      mejorComida: ['']
    });
  }

  setStarRating(rating: number) {
    this.cantidadEstrellas = rating;
    this.updateStarRating();
    console.log("Cantidad las estrellas: "+ this.cantidadEstrellas);
    
  }

  updateStarRating() {
    const starFull = '../../../assets/starFull.png';
    const starEmpty = '../../../assets/starEmpty.png';

    this.stars = Array(5).fill(starEmpty).map((_, index) => index < this.cantidadEstrellas ? starFull : starEmpty);
  }

  onRangeChange(event: any) {
    this.puntajeSaborDeLaComida = event.detail.value;
    if (this.puntajeSaborDeLaComida <= 4) {
      this.textoSaborDeLaComida = "Estaba muy fea :(";
    } else if(this.puntajeSaborDeLaComida >= 5 && this.puntajeSaborDeLaComida <=7) {
      this.textoSaborDeLaComida = "Estaba bien :|";
      
    }else{
      this.textoSaborDeLaComida = "Estaba muy rica :)";
    }
    console.log('Puntaje abor de la Comida:', this.puntajeSaborDeLaComida);
  }

  getCheckBoxValuesChange(){
    let checkControls = this.listaDeCosas.filter(result=>result.si==true);
    console.log('Cosas que le agradaron al cliente:', checkControls);  
  }

  checkValorRecomendarLugar(event: any){
    this.valorRecomendarLugar = event.detail.value;
    console.log(this.valorRecomendarLugar);
    
  }

  getSelectValuesChange(){
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
        this.imageTomadaURL = photo.dataUrl!; // La URL de la imagen capturada

        if (photo.base64String !== 'No Image Selected') {
          this.imagenParaCargar = {
            dataUrl: photo.dataUrl!,
            formato: photo.format,
          };
        } else {
          console.log('No se selecciono imagen');
        }
        this.selectedPhotos.push(this.imageTomadaURL);
        console.log(this.selectedPhotos);
        
      })
      .catch((err) => {
        console.log(err);
        this.router.navigate([this.router.url]);
      });
  }

}
