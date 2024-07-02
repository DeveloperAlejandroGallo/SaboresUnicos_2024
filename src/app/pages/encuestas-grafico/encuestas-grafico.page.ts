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
       title:  this.dataCantidadEstrellas[posicion].label,
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

  cambiarGrafico() {
    this.estrellas = !this.estrellas;
    this.icono = this.estrellas ? '../../../assets/img/barchart.png' : '../../../assets/img/piechart.png';
    }

  // ngAfterViewInit() { // Método ngAfterViewInit
  //   const canvasElement = document.getElementById('myChart') as HTMLCanvasElement; // Usamos una afirmación de tipo
  //   this.ctx = canvasElement.getContext('2d');
  //   this.configurarGrafico();
  // }

  // configurarGrafico() {
  //   this.myChart = new Chart(this.ctx, {
  //     type: 'bar',
  //     data: {
  //       labels: this.datos.map((dato: any) => dato.label),
  //       datasets: [{
  //         label: '# de veces elegida como favorita',
  //         data: this.datos.map((dato: any) => dato.value),
  //         backgroundColor: [
  //           'rgba(255, 99, 132, 0.2)',
  //           'rgba(54, 162, 235, 0.2)',
  //           'rgba(255, 206, 86, 0.2)',
  //           'rgba(75, 192, 192, 0.2)',
  //           'rgba(153, 102, 255, 0.2)',
  //           'rgba(255, 159, 64, 0.2)'
  //         ],
  //         borderColor: [
  //           'rgb(255, 99, 132)',
  //           'rgb(54, 162, 235)',
  //           'rgb(255, 206, 86)',
  //           'rgb(75, 192, 192)',
  //           'rgb(153, 102, 255)',
  //           'rgb(255, 159, 64)'
  //         ],
  //         borderWidth: 1
  //       }]
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true
  //         }
  //       }
  //     }
  //   });
  // }

  // configurarGrafico() {
  //   this.myChart = new Chart(this.ctx, {
  //     type: 'doughnut', // Cambia 'bar' a 'doughnut'
  //     data: {
  //       labels: this.datos.map((dato: any) => dato.label), // Labels para los segmentos del gráfico
  //       datasets: [{
  //         label: '# de veces',
  //         data: this.datos.map((dato: any) => dato.value), // Datos para los segmentos del gráfico
  //         backgroundColor: [
  //           'rgba(255, 99, 132, 0.2)',
  //           'rgba(54, 162, 235, 0.2)',
  //           'rgba(255, 206, 86, 0.2)',
  //           'rgba(75, 192, 192, 0.2)',
  //           'rgba(153, 102, 255, 0.2)',
  //           'rgba(255, 159, 64, 0.2)' // Asegúrate de tener suficientes colores para todos los posibles valores de cantidadEstrellas
  //         ].slice(0, this.datos.length), // Usa slice para adaptar el array de colores al número de datos
  //         borderColor: [
  //           'rgb(255, 99, 132)',
  //           'rgb(54, 162, 235)',
  //           'rgb(255, 206, 86)',
  //           'rgb(75, 192, 192)',
  //           'rgb(153, 102, 255)',
  //           'rgb(255, 159, 64)'
  //         ].slice(0, this.datos.length), // Lo mismo para borderColors
  //         borderWidth: 1
  //       }]
  //     },
  //     options: {
  //       cutout: '80%', // Opcional: ajusta el espacio entre los segmentos del gráfico
  //       plugins: {
  //         legend: {
  //           position: 'top', // Posiciona la leyenda en la parte superior del gráfico
  //         },
  //         title: {
  //           display: true,
  //           text: 'Cantidad de Estrellas Por Encuesta' // Título opcional para el gráfico
  //         }
  //       }
  //     }
  //   });
  // }


  volver() {
    this.router.navigate(['/home-tabs/home']);
  }

}
