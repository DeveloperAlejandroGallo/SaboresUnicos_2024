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
import { Mesa } from '../models/mesa';
import { where } from 'firebase/firestore';




@Injectable({
  providedIn: 'root'
})
export class MesaService {


  private colectionName: string = 'mesas';
  private coleccionMesa: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.coleccionMesa = collection(this.firestore, this.colectionName);
   }

  public listadoMesa!: Array<Mesa>;


  get allUsers$(): Observable<Mesa[]> {
    const ref = collection(this.firestore, 'mesas');
    const queryAll = query(ref);
    return collectionData(queryAll) as Observable<Mesa[]>;
  }

  public getMesa(): Observable<Mesa[]> {
    const refOfUsers = collection(this.firestore, this.colectionName);
    return collectionSnapshots(refOfUsers).pipe(
      map((res) =>
        res.map((data) => {
          const id = data.id;
          const docData = data.data() as Mesa; // Cast the data to Usuario type
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
      this.listadoMesa = respuesta as Array<Mesa>;
    });

    this.getMesa().subscribe((espera) => {
      this.listadoMesa = espera;
    });
  }



  delete(id: string){
    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,id);
    deleteDoc(documento);
  }


//Mesa
  nuevo(mesa: Mesa): Promise<void>{

    const docuNuevo = doc(this.coleccionMesa);
    // addDoc(coleccion, objeto);
    const nuevoId = docuNuevo.id;

    mesa.id = nuevoId;

    return setDoc(docuNuevo, {
      id: mesa.id,
      asientos: mesa.asientos,
      estado: mesa.estado,
      numero: mesa.numero
    });


  }

}
