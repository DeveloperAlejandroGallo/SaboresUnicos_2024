import { Injectable } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp, orderBy, where } from 'firebase/firestore';
import { Observable } from 'rxjs';
import {
  Firestore, collection, query, collectionData, CollectionReference,
  DocumentData,setDoc,doc
} from '@angular/fire/firestore';
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

  buscarEnListaXuid(uid: string): Observable<any[]> {
    const queryByUid = query(collection(this.firestore, 'lista_espera'), where('uid', '==', uid));
    return collectionData(queryByUid);
  }
  agregarAListaEspera(id: string, nombre_completo: string, fecha_de_ingreso: Timestamp) {
    return setDoc(doc(collection(this.firestore, 'lista_espera')),{
      uid: id,
      nombre: nombre_completo,
      fecha_ingreso: fecha_de_ingreso
    });
  }
  traerMesas(): Observable<any[]> {
    const queryAll = query(collection(this.firestore, 'mesas'));
    return collectionData(queryAll);
  }
/*

  traerListaEspera(): Observable<any[]> {
    return this.firestore.collection('lista_espera', ref => ref.orderBy('fecha_ingreso', 'desc')).valueChanges();
    
  }
  buscarEnListaXuid(uid: string): Observable<any[]> {
    return this.firestore.collection('lista_espera', ref => ref.where('uid', '==', uid)).valueChanges();
  }
  agregarAListaEspera(uid: string, nombre: string, fecha_ingreso: Timestamp): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('lista_espera').doc(id).set({ uid, nombre, fecha_ingreso });
  }
  traerMesas(): Observable<any[]> {
    return this.firestore.collection('mesas').valueChanges();
  }*/
}
