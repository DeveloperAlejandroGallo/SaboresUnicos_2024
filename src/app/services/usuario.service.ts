import { Injectable } from '@angular/core';
import { addDoc, collection, collectionChanges, collectionData, CollectionReference, collectionSnapshots, deleteDoc, doc, DocumentData, Firestore, getDoc, getDocs, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario';
import { map, Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  private colectionName: string = 'usuarios';
  private coleccionUsuarios: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.coleccionUsuarios = collection(this.firestore, this.colectionName);
   }

  public listadoUsuarios!: Array< Usuario>;


  get allUsers$(): Observable<Usuario[]> {
    const ref = collection(this.firestore, 'usuarios');
    const queryAll = query(ref);
    return collectionData(queryAll) as Observable<Usuario[]>;
  }

  public getUsuarios(): Observable<Usuario[]> {
    const refOfUsers = collection(this.firestore, this.colectionName);
    return collectionSnapshots(refOfUsers).pipe(
      map(res => res.map(data => {
        const id = data.id;
        const docData = data.data() as Usuario; // Cast the data to Usuario type
        return { ...docData, id };
      }))
    );
  }

//Genericos
  traer(){
    const coleccion = collection(this.firestore, this.colectionName);
    const observable = collectionData(coleccion);

    observable.subscribe((respuesta)=>{
      this.listadoUsuarios = respuesta as Array<Usuario>;
    });

    this.getUsuarios().subscribe(usuarios => {
      this.listadoUsuarios = usuarios;
    });
  }



  delete(id: string){
    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,id);
    deleteDoc(documento);
  }


//Usuario
  nuevo(usuario: Usuario) {

    const docuNuevo = doc(this.coleccionUsuarios);
    // addDoc(coleccion, objeto);
    const nuevoId = docuNuevo.id;

    setDoc(docuNuevo, {
      id: nuevoId,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      clave: usuario.clave,

      esAdmin: true
    });
  }


  actualizar(usuario: Usuario) {

    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,usuario.id);

    updateDoc(documento, {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      clave: usuario.clave,
    });
  }


  aprobarCuenta(usuario: Usuario){
    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,usuario.id);
    updateDoc(documento,{
      cuentaAprobada: true
    })
  }

  existeUsuario(email: string): boolean{

    let usrBuscado = this.listadoUsuarios?.find(x=>x.email == email);
    return usrBuscado != undefined ? true : false ;
  }
}
