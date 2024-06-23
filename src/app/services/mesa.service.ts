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
import { Mesa } from '../models/mesa';
import { map, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MesaService {

  private colectionName: string = 'mesas';
  private coleccionMesas: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.coleccionMesas = collection(this.firestore, this.colectionName);
   }

  public listadoMesas!: Array<Mesa>;

  get allMesas$(): Observable<Mesa[]> {
    const ref = collection(this.firestore, 'mesas');
    const queryAll = query(ref);
    return collectionData(queryAll) as Observable<Mesa[]>;
  }

  public getMesas(): Observable<Mesa[]> {
    const refOfMesas = collection(this.firestore, this.colectionName);
    return collectionSnapshots(refOfMesas).pipe(
      map((res) =>
        res.map((data) => {
          const id = data.id;
          const docData = data.data() as Mesa; 
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
      this.listadoMesas = respuesta as Array<Mesa>;
    });

    this.getMesas().subscribe((mesas) => {
      this.listadoMesas = mesas;
    });
  }



  delete(id: string){
    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,id);
    deleteDoc(documento);
  }

  actualizar(mesa: Mesa) {

    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,mesa.id);

    updateDoc(documento, {
      cant_asientos: mesa.cant_asientos,
      cliente_uid: mesa.cliente_uid,
      estado: mesa.estado,
      numero: mesa.numero,
      nombre_cliente: mesa.nombre_cliente,
    });
  }


}
