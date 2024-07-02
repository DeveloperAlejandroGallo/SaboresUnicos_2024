import { Component, EventEmitter, OnInit, Output, AfterViewInit, ViewChild, HostListener  } from '@angular/core';
import { Encuesta } from 'src/app/models/encuesta';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { EncuestaService } from 'src/app/services/encuesta.service';
import { Router } from '@angular/router';
import { AdvancedPieChartComponent, LegendPosition, NgxChartsModule, PieChartComponent, ScaleType } from '@swimlane/ngx-charts';
import { Platform } from '@ionic/angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-encuestas-grafico',
  templateUrl: './encuestas-grafico.page.html',
  styleUrls: ['./encuestas-grafico.page.scss'],
})
export class EncuestasGraficoPage {

  @ViewChild(PieChartComponent) pieChart!: PieChartComponent;
  
  titulo: string = 'Resultados de la votación';
  single: any[] = [];
  view: [number, number] = [100, 100];
  public estrellas: boolean = true;
  public mejorComida: boolean = false;
  public icono: string = '../../../assets/img/barchart.png';
  
  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: LegendPosition = LegendPosition.Below;
// options
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = 'Nombre';
  showYAxisLabel = true;
  yAxisLabel = 'Votos';
  public radio: number = 6;
  datos: any

  public usuario: Usuario;
  public listaEncuestas: Array<Encuesta> = new Array<Encuesta>;
  dataCantidadEstrellas!: Array<{name: string, value: number, label: string}>;
  dataConteoComidas!: Array<{name: string, value: number, label: string}>;

  constructor(
    private auth: AuthService,
    private encuestaService: EncuestaService,
    private router: Router,
    private platform: Platform
   ) {
    
    this.usuario = this.auth.usuarioActual!;
    this.encuestaService.allEncuestas$.subscribe((encuestas) => {
      this.listaEncuestas = encuestas;
      console.log(this.listaEncuestas);

      let conteoEstrellas: Record<number, number> = {};
      let conteoComidas: Record<string, number> = {}; // Definición explícita del tipo

      this.listaEncuestas.forEach(encuesta => {
        if (!conteoEstrellas[encuesta.cantidadEstrellas]) {
          conteoEstrellas[encuesta.cantidadEstrellas] = 1;
        } else {
          conteoEstrellas[encuesta.cantidadEstrellas]++;
        }
      });

      this.dataCantidadEstrellas = Object.entries(conteoEstrellas).map(([estrellas, cantidad]) => ({
        name: 'Cantidad estrellas' + cantidad.toString(),
        label: `${cantidad} Estrellas`,
        value: cantidad
      }));

      this.listaEncuestas.forEach(encuesta => {
        if (!conteoComidas[encuesta.MejorComida.nombre]) {
          conteoComidas[encuesta.MejorComida.nombre] = 1;
        } else {
          conteoComidas[encuesta.MejorComida.nombre]++;
        }
      });
    
      this.dataConteoComidas = Object.entries(conteoComidas).map(([nombre, cantidad]) => ({
        name: nombre,
        label: nombre,
        value: cantidad
      }));

      // var cont = 1;
      // this.dataCantidadEstrellas = encuestas.filter(x=>x.cantidadEstrellas).map(estrella => {
      //   return {
      //     name: (cont++).toString(), value: estrella.cantidadEstrellas, label: `${estrella.cantidadEstrellas} Estrellas`}
      // }) ;
      // cont = 1;
      // this.dataFotosFeas = images.filter(x=>!x.esLinda && x.votos.length > 0).map(img => {
      //   return {name: (cont++).toString(), value: img.votos.length, label: img.nombre, imagen: img.url}
      // }) ;

    });

  }

  ngAfterContentChecked() {
    if (this.pieChart) {
      //console.log('PieChart', this.pieChart);
      this.pieChart.outerRadius = 110; // Ajusta el radio externo
      // this.pieChart.height = 100; // Ajusta la altura
      // this.pieChart.width = 100; // Ajusta el ancho
      this.pieChart.margins = [10, 10, 10, 10]; // Ajusta los márgenes
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.handleScreenSizeChange();
  }
  handleScreenSizeChange() {
    const width = this.platform.width();
    const height = this.platform.height();
    if(width > height){
      this.view = [0.9 * width, 0.9 * height];
    }else{
      this.view = [0.95 * width, 0.35 * height];
    }
  }

  onSelect(data: any, cual: string): void {
    //console.log('Item clicked', JSON.parse(JSON.stringify(data)));

    var posicion: number = parseInt(data.name) - 1;

    Swal.fire({
       //title:  this.dataCantidadEstrellas[posicion].label,
      text: 'Cantidad de veces votado: ' + data.value,
      showCloseButton: true,
      heightAuto: false,
    });
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  // cambiarGrafico() {
  //   this.estrellas = !this.estrellas;
  //   this.icono = this.estrellas ? '../../../assets/img/barchart.png' : '../../../assets/img/piechart.png';
  //   }

    irGraficoEstrellas(){
      this.estrellas = !this.estrellas;
      this.estrellas = !this.estrellas;
      this.icono= '../../../assets/img/piechart.png';
    }

    irGraficoMejorComida(){
      this.mejorComida = !this.mejorComida;
      this.estrellas = !this.estrellas;
      this.icono= '../../../assets/img/barchart.png';
    }


  volver() {
    this.router.navigate(['/home-tabs/home']);
  }

}
