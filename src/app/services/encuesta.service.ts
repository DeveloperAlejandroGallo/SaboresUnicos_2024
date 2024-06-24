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




@Injectable({
  providedIn: 'root'
})
export class EncuestaService {


  private colectionName: string = 'encuestas';
  private coleccionEncuesta: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.coleccionEncuesta = collection(this.firestore, this.colectionName);
   }

  public listadoEncuesta!: Array<Encuesta>;


  get allEncuestas$(): Observable<Encuesta[]> {
    const ref = collection(this.firestore, 'encuestas');
    const queryAll = query(ref, orderBy('fecha', 'desc'));
    return collectionData(queryAll) as Observable<Encuesta[]>;
  }

  public getEncuesta(): Observable<Encuesta[]> {
    const refOfUsers = collection(this.firestore, this.colectionName);
    return collectionSnapshots(refOfUsers).pipe(
      map((res) =>
        res.map((data) => {
          const id = data.id;
          const docData = data.data() as Encuesta; // Cast the data to Usuario type
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
      this.listadoEncuesta = respuesta as Array<Encuesta>;
    });

    this.getEncuesta().subscribe((espera) => {
      this.listadoEncuesta = espera;
    });
  }



  delete(id: string){
    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,id);
    deleteDoc(documento);
  }


//Usuario
  nuevo(encuesta: Encuesta): Promise<void> {

    const docuNuevo = doc(this.coleccionEncuesta);
    // addDoc(coleccion, objeto);
    const nuevoId = docuNuevo.id;

    encuesta.id = nuevoId;

    return setDoc(docuNuevo, {
      id: nuevoId,
      cliente: encuesta.cliente,
      fecha: encuesta.fecha, // solo 1 por dia
      fotos: encuesta.fotos, //Maximo 3 fotos
      comentario: encuesta.comentario, //Input de texto - Comentario.
      cantidadEstrellas: encuesta.cantidadEstrellas, //Input de 1 a 5 - Servicio Total. Deben ser 5 imagenes responsive
      SaborDeLaComida: encuesta.SaborDeLaComida, //Range de 1 a 10 - Sabor de la comida.
      RecomendariasElLugar: encuesta.RecomendariasElLugar, //Radio Button - Si o No - Volverias a visitarnos.
      QueCosasAgradaron: encuesta.QueCosasAgradaron, //Checkbox - Que cosas te agradaron. [comida, tragos, atencion, lugar, precio, otros]
      MejorComida: encuesta.MejorComida, //Select - Con nombre de producto tipo comida.
    });

  }






}
