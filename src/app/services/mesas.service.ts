import { Injectable } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp, orderBy, where } from 'firebase/firestore';
import { Observable } from 'rxjs';
import {
  Firestore, collection, query, collectionData, CollectionReference,
  DocumentData,setDoc,doc
} from '@angular/fire/firestore';
import { Usuario } from '../models/usuario';
@Injectable({
  providedIn: 'root'
})
export class MesasService {
  constructor(private firestore: Firestore) { 
    
  }
  traerListaEspera(): Observable<any[]> {
    const queryAll = query(collection(this.firestore, 'lista_espera'), orderBy('fecha_ingreso', 'desc'));
    return collectionData(queryAll);
    
  }

  buscarEnListaXid(id: string): Observable<any[]> {
    const queryByUid = query(collection(this.firestore, 'lista_espera'), where('id', '==', id));
    return collectionData(queryByUid);
  }

  agregarAListaEspera(usuario: Usuario, fecha_de_ingreso: Timestamp) {
    const docNuevo = doc(collection(this.firestore,'lista_espera'));
    const idNuevo = docNuevo.id;
    return setDoc(doc(collection(this.firestore, 'lista_espera')),{
      id: idNuevo,
      cliente: usuario,
      fecha_ingreso: fecha_de_ingreso
    });
  }
  
  traerMesas(): Observable<any[]> {
    const queryAll = query(collection(this.firestore, 'mesas'));
    return collectionData(queryAll);
  }
}
