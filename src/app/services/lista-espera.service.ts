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
import { ListaEspera } from '../models/lista-espera';
import { orderBy, where } from 'firebase/firestore';



@Injectable({
  providedIn: 'root'
})
export class ListaEsperaService {


  private colectionName: string = 'lista_espera';
  private coleccionListaEspera: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.coleccionListaEspera = collection(this.firestore, this.colectionName);
   }

  public listadoListaEspera!: Array<ListaEspera>;


  get allListaEspera$(): Observable<ListaEspera[]> {
    const ref = collection(this.firestore, 'lista_espera');
    const queryAll = query(ref, orderBy('fecha_ingreso', 'asc'));
    return collectionData(queryAll) as Observable<ListaEspera[]>;
  }

  public getListaEspera(): Observable<ListaEspera[]> {
    const refOfUsers = collection(this.firestore, this.colectionName);
    return collectionSnapshots(refOfUsers).pipe(
      map((res) =>
        res.map((data) => {
          const id = data.id;
          const docData = data.data() as ListaEspera; // Cast the data to Usuario type
          return { ...docData, id };
        })
      )
    );
  }

//Genericos
  traer(){
    const coleccion = collection(this.firestore, this.colectionName);
    const observable = collectionData(coleccion);

    observable.subscribe((respuesta)=>{
      this.listadoListaEspera = respuesta as Array<ListaEspera>;
    });

    this.getListaEspera().subscribe((espera) => {
      this.listadoListaEspera = espera;
    });
  }



  delete(id: string){
    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,id);
    deleteDoc(documento);
  }


//Usuario
  nuevo(usuario: Usuario): Promise<void> {

    const docuNuevo = doc(this.coleccionListaEspera);
    // addDoc(coleccion, objeto);
    const nuevoId = docuNuevo.id;

    return setDoc(docuNuevo, {
      id: nuevoId,
      usuario: usuario,
      fecha_ingreso: Timestamp.fromDate(new Date())
    });

  }


  buscarEnListaXid(idClient:string){
    const ref = collection(this.firestore, this.colectionName);
    const queryAll = query(ref, where('usuario.id','==',idClient));
    return collectionData(queryAll) as Observable<ListaEspera[]>;
  }




}
