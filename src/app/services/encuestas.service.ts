import { Injectable } from '@angular/core';
import {
  Firestore, collection, query, collectionData, CollectionReference,
  DocumentData,setDoc,doc
} from '@angular/fire/firestore';
import { orderBy } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncuestasService {
  constructor(private firestore: Firestore) { 
    
  }

  traerListaEncuestas(): Observable<any[]> {
    const queryAll = query(collection(this.firestore, 'encuestas'), orderBy('fecha', 'desc'));
    return collectionData(queryAll);
    
  }
}
