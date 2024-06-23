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
import { Usuario } from '../models/usuario';
import { map, Observable } from 'rxjs';
import { Perfil } from '../enums/perfil';
import {User} from '@angular/fire/auth';



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
      map((res) =>
        res.map((data) => {
          const id = data.id;
          const docData = data.data() as Usuario; // Cast the data to Usuario type
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
      this.listadoUsuarios = respuesta as Array<Usuario>;
    });

    this.getUsuarios().subscribe((usuarios) => {
      this.listadoUsuarios = usuarios;
    });
  }



  delete(id: string){
    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,id);
    deleteDoc(documento);
  }


//Usuario
  nuevo(usuario: Usuario): Usuario {

    const docuNuevo = doc(this.coleccionUsuarios);
    // addDoc(coleccion, objeto);
    const nuevoId = docuNuevo.id;

    usuario.id = nuevoId;

    setDoc(docuNuevo, {
      id: nuevoId,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      clave: usuario.clave,
      foto: usuario.foto,
      // esAdmin: usuario.esAdmin,
      dni: usuario.dni,
      cuil: usuario.cuil,
      perfil: usuario.perfil,
      tipoEmpleado: usuario.perfil !== (Perfil.Anonimo && Perfil.Cliente) ? usuario.tipoEmpleado : null,
      activo: usuario.perfil == Perfil.Anonimo ? true : false,
      mesaAsignada: 0
    });

    return usuario;
  }


  actualizar(usuario: Usuario) {

    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,usuario.id);

    updateDoc(documento, {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      clave: usuario.clave,
      foto: usuario.foto,
      // esAdmin: usuario.esAdmin,
      dni: usuario.dni,
      cuil: usuario.cuil,
      perfil: usuario.perfil,
      tipoEmpleado: usuario.tipoEmpleado,
      activo: usuario.activo,
      mesaAsignada: usuario.mesaAsignada
    });
  }


  aprobarCuenta(usuario: Usuario){
    const coleccion = collection(this.firestore, this.colectionName);
    const documento = doc(coleccion,usuario.id);
    updateDoc(documento,{
      activo: true
    })
  }

  existeUsuario(email: string): boolean{

    let usrBuscado = this.listadoUsuarios?.find(x=>x.email == email);
    return usrBuscado != undefined ? true : false ;
  }



  // actualizarCamposNuevos(){

  //   this.listadoUsuarios.forEach((usuario) => {
  //     const coleccion = collection(this.firestore, this.colectionName);
  //     const documento = doc(coleccion,usuario.id);

  //     updateDoc(documento, {
  //       cuil: this.calcularCUIT(usuario.dni.toString()),
  //       perfil: Perfil.Cliente,
  //       tipoEmpleado:  null,
  //       activo:  true
  //     });
  //   });



  // }


  calcularCUIT(dni: string): string {

      let cuit: Array<number> = [];
      let cantCeros = 8 - dni!.length;
      let result: string;
      cuit[0] = 2;
      cuit[1] =  0 ;
      for (let i = 0; i < cantCeros; i++)
        cuit.push(0);

      for (let i = 0; i < dni.length; i++) {
        if (!Number.isNaN(dni[i]))
          cuit.push(Number.parseInt(dni[i]));
      }
      let tot: number = 0;
      tot += cuit[0] * 5;
      tot += cuit[1] * 4;
      tot += cuit[2] * 3;
      tot += cuit[3] * 2;
      tot += cuit[4] * 7;
      tot += cuit[5] * 6;
      tot += cuit[6] * 5;
      tot += cuit[7] * 4;
      tot += cuit[8] * 3;
      tot += cuit[9] * 2;

      let digVer: number;

      switch (tot % 11) {
        case 0:
          digVer = 0;
          break;
        case 1:
          digVer = cuit[1] == 0 ? 9 : 4;
          cuit[1] = 3;
          break;
        default:
          digVer = 11 - (tot % 11);
          break;
      }
      cuit[10] = digVer;
      let ret: string = cuit.join('');

      return ret.substring(0, 11);
    }


}
