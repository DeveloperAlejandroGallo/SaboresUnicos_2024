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
  Timestamp,
  updateDoc,
} from '@angular/fire/firestore';
import { Usuario } from '../models/usuario';
import { map, Observable } from 'rxjs';
import { Perfil } from '../enums/perfil';
import {User} from '@angular/fire/auth';
import { orderBy, where } from 'firebase/firestore';
import { Pedido } from '../models/pedido';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class PedidoService {


  private colectionName: string = 'pedidos';
  private coleccionPedido: CollectionReference<DocumentData>;
  public pedido$!: Observable<Usuario>;

  constructor(private firestore: Firestore, private angularFirestore: AngularFirestore) {
    this.coleccionPedido = collection(this.firestore, this.colectionName);
   }

  public listadoPedidos!: Array<Pedido>;


  get allPedidos$(): Observable<Pedido[]> {
    const ref = collection(this.firestore, this.colectionName);
    const queryAll = query(ref, orderBy('fecha_ingreso', 'asc'));
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
    const documentoRef = this.angularFirestore.doc<Usuario>(`${this.colectionName}/${id}`);
    return this.pedido$ = documentoRef.valueChanges() as Observable<Usuario>;
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
  nuevo(pedido: Pedido): Promise<void> {

    const docuNuevo = doc(this.coleccionPedido);
    // addDoc(coleccion, objeto);
    const nuevoId = docuNuevo.id;

    return setDoc(docuNuevo, {

    });

  }


  buscarEnListaXid(idClient:string){
    const ref = collection(this.firestore, this.colectionName);
    const queryAll = query(ref, where('usuario.id','==',idClient));
    return collectionData(queryAll) as Observable<Pedido[]>;
  }




}
