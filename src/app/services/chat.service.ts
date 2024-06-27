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
import { map, Observable } from 'rxjs';
import { Encuesta } from '../models/encuesta';
import { orderBy } from 'firebase/firestore';
import { Usuario } from '../models/usuario';
import { Producto } from '../models/producto';
import { TipoProducto } from '../enums/tipo-producto';
import { Mensaje } from '../models/mensaje';


@Injectable({
    providedIn: 'root'
  })

  export class ChatService {

   private colectionName: string = 'mensajes';
   private coleccionMensajes: CollectionReference<DocumentData>;

    constructor(private firestore: Firestore) {
    this.coleccionMensajes = collection(this.firestore, this.colectionName);
  }
  
  public listadoMensajes!: Array<Mensaje>;


  get allMensajes$(): Observable<Mensaje[]> {
    const ref = collection(this.firestore, 'mensajes');
    const queryAll = query(ref);
    return collectionData(queryAll) as Observable<Mensaje[]>;
  }

  public getMensaje(): Observable<Mensaje[]> {
    const refOfUsers = collection(this.firestore, this.colectionName);
    return collectionSnapshots(refOfUsers).pipe(
      map((res) =>
        res.map((data) => {
          const id = data.id;
          const docData = data.data() as Mensaje; // Cast the data to Usuario type
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
      this.listadoMensajes = respuesta as Array<Mensaje>;
    });

    this.getMensaje().subscribe((mensaje) => {
      this.listadoMensajes = mensaje;
    });
  }



  delete(id: string){
    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,id);
    deleteDoc(documento);
  }


//Usuario
  nuevo(mensj: Mensaje): Promise<void> {

    const docuNuevo = doc(this.coleccionMensajes,mensj.fecha.toString());
    // addDoc(coleccion, objeto);
    const nuevoId = docuNuevo;

    //mensj.id = nuevoId;

    return setDoc(docuNuevo, {
      id: mensj.fecha.toString(),
      numeroDeMesa: mensj.numeroDeMesa,
      nombreMozo: mensj.nombreMozo,
      mensaje: mensj.mensaje,
      fecha: mensj.fecha,
      idDelEnviador: mensj.idDelEnviador

    });

  }
  
  }