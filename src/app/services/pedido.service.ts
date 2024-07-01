import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionChanges,
  collectionData,
  CollectionReference,
  collectionSnapshots,
  deleteDoc,
  doc,
  DocumentData,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Usuario } from '../models/usuario';
import { map, Observable } from 'rxjs';
import { Perfil } from '../enums/perfil';
import {User} from '@angular/fire/auth';
import { orderBy, where } from 'firebase/firestore';
import { Pedido } from '../models/pedido';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Mesa } from '../models/mesa';
import { EstadoPedido } from '../enums/estado-pedido';
import { Timestamp } from "firebase/firestore";
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {


  private colectionName: string = 'pedidos';
  private coleccionPedido: CollectionReference<DocumentData>;
  public pedido$: Observable<Pedido> = new Observable<Pedido>();

  constructor(private firestore: Firestore, private angularFirestore: AngularFirestore) {
    this.coleccionPedido = collection(this.firestore, this.colectionName);
   }

  public listadoPedidos!: Array<Pedido>;


  get allPedidos$(): Observable<Pedido[]> {
    const ref = collection(this.firestore, this.colectionName);
    const queryAll = query(ref, orderBy('fechaIngreso', 'asc'));
    return collectionData(queryAll) as Observable<Pedido[]>;
  }

  public getPedidos(): Observable<Pedido[]> {
    const refOfUsers = collection(this.firestore, this.colectionName);
    return collectionSnapshots(refOfUsers).pipe(
      map((res) =>
        res.map((data) => {
          const id = data.id;
          const docData = data.data() as Pedido; // Cast the data to Usuario type
          return { ...docData, id };
        })
      )
    );
  }


  escucharPedidoId(id: string) {
    const documentoRef = this.angularFirestore.doc<Pedido>(`${this.colectionName}/${id}`);
    return this.pedido$ = documentoRef.valueChanges() as Observable<Pedido>;
  }

//Genericos
  traer(){
    const coleccion = collection(this.firestore, this.colectionName);
    const observable = collectionData(coleccion);

    observable.subscribe((respuesta)=>{
      this.listadoPedidos = respuesta as Array<Pedido>;
    });

    this.getPedidos().subscribe((pedidos) => {
      this.listadoPedidos = pedidos;
    });
  }



  delete(id: string){
    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,id);
    deleteDoc(documento);
  }


//Usuario
  nuevo(cliente: Usuario, mesa: Mesa): Pedido {
    const docuNuevo = doc(this.coleccionPedido);
    const nuevoId = docuNuevo.id;
    const pedido: Pedido = {
      id: nuevoId,
      cliente: cliente,
      descuentoPorJuego: 0,
      estadoPedido: EstadoPedido.Pendiente,
      fechaDePedidoAceptado: null,
      fechaIngreso: Timestamp.now(),
      mesa: mesa,
      mozo: null,
      productos: new Array<{producto:Producto, cantidad: number}>(),
      propina: 0,
      subTotal: 0,
      tiempoEstimado: 0,
      total: 0
    }
    try{
     setDoc(docuNuevo, {
      id: pedido.id,
      cliente: pedido.cliente,
      descuentoPorJuego: pedido.descuentoPorJuego,
      estadoPedido: pedido.estadoPedido,
      fechaDePedidoAceptado: pedido.fechaDePedidoAceptado,
      fechaIngreso: pedido.fechaIngreso,
      mesa: pedido.mesa,
      mozo: pedido.mozo,
      productos: pedido.productos,
      propina: pedido.propina,
      subTotal: pedido.subTotal,
      tiempoEstimado: pedido.tiempoEstimado,
      total: pedido.total
    });

    console.log('Pedido creado');

  }catch(ex){
    console.error(ex);
  }
  return pedido;

  }


  actualizarProducto(pedido: Pedido) {

    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,pedido.id);

    pedido.productos = pedido.productos;

    updateDoc(documento, {
      productos: pedido.productos,
      subTotal: this.sumaProductos(pedido.productos),
      tiempoEstimado: pedido.tiempoEstimado,
      total: this.sumTotal(pedido)
    });
  }

  sumTotal(pedido: Pedido): number {

    let sum = 0;
    sum = this.sumaProductos(pedido.productos);

    if(pedido.descuentoPorJuego != 0)
      sum -= sum * pedido.descuentoPorJuego

    sum += pedido.propina;

    sum

    return sum;
  }


  sumaProductos(productos: { producto: Producto; cantidad: number; }[]): number {
    let sum = 0;
    productos.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);

    return sum;

  }


  actualizarMozo(pedido: Pedido, mozo: Usuario) {

    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,pedido.id);

    updateDoc(documento, {
      mozo: mozo,
    });
  }

  actualizarFechaAceptado(pedido: Pedido){
    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,pedido.id);

    updateDoc(documento, {
      fechaDePedidoAceptado: Timestamp.fromDate(new Date()),
    });
    this.actualizarEstado(pedido, EstadoPedido.Aceptado);
  }


  actualizarEstado(pedido: Pedido, estado: EstadoPedido) {

    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,pedido.id);

    updateDoc(documento, {

      estadoPedido: estado,

    });
  }

  aplicarDescuentoPorJuego(pedido: Pedido, porcentaje: number) {

    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,pedido.id);

    updateDoc(documento, {
      descuentoPorJuego: porcentaje,
      total: pedido.subTotal - ((pedido.subTotal * porcentaje) / 100) + pedido.propina
    });
  }

  aplicarPropina(pedido: Pedido, propina: number) {

    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,pedido.id);

    updateDoc(documento, {
      propina: propina,
      total: pedido.total + propina
    });
  }

}
