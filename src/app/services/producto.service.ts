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
import { Producto } from '../models/producto';




@Injectable({
  providedIn: 'root'
})
export class ProductoService {


  private colectionName: string = 'productos';
  private coleccionProducto: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.coleccionProducto = collection(this.firestore, this.colectionName);
   }

  public listadoProducto!: Array<Producto>;


  get allProductos$(): Observable<Producto[]> {
    const ref = collection(this.firestore, 'productos');
    const queryAll = query(ref);
    return collectionData(queryAll) as Observable<Producto[]>;
  }

  public getProducto(): Observable<Producto[]> {
    const refOfUsers = collection(this.firestore, this.colectionName);
    return collectionSnapshots(refOfUsers).pipe(
      map((res) =>
        res.map((data) => {
          const id = data.id;
          const docData = data.data() as Producto; // Cast the data to Usuario type
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
      this.listadoProducto = respuesta as Array<Producto>;
    });

    this.getProducto().subscribe((producto) => {
      this.listadoProducto = producto;
    });
  }



  delete(id: string){
    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,id);
    deleteDoc(documento);
  }


//Usuario
  nuevo(prod: Producto): Promise<void> {

    const docuNuevo = doc(this.coleccionProducto);
    // addDoc(coleccion, objeto);
    const nuevoId = docuNuevo.id;

    prod.id = nuevoId;

    return setDoc(docuNuevo, {
      id: nuevoId,
      nombre: prod.nombre,
      descripcion: prod.descripcion,
      precio: prod.precio,
      tiempoPreparacionEnMinutos: prod.tiempoPreparacionEnMinutos,
      fotos: prod.fotos,
      tipo: prod.tipo,


    });

  }


    tipoPord = ['Comida', 'Bebida', 'Postre'];
    comida = ['Hamburguesa', 'Pizza', 'Milanesa', 'Empanadas', 'Papas Fritas', 'Ensalada', 'Sushi', 'Tacos', 'Burritos', 'Parrilla', 'Pastas', 'Pollo', 'Pescado', 'Sopa', 'Sandwich', 'Tarta', 'Wok', 'Otro'];
    bebida = ['Agua', 'Gaseosa', 'Cerveza', 'Vino', 'Jugo', 'Cafe', 'Te', 'Licuado', 'Coctel', 'Otro'];
    postre = ['Helado', 'Torta', 'Fruta', 'Tiramisu', 'Flan', 'Churros', 'Brownie', 'Cheesecake', 'Mousse', 'Alfajor', 'Otro'];


    

}
