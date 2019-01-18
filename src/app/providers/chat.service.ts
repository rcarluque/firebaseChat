import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

import { Mensaje } from '../interfaces/mensaje.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  public chats: Mensaje[] = [];
  public usuario: any = {};

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) {
    // Escuchamos los cambios del estado de la autenticación
    this.afAuth.authState.subscribe(user => {
      if (!user) {
        return;
      }

      if (user.displayName === null) {
        this.usuario.nombre = user.email.substring(0, user.email.lastIndexOf('@'));
      } else {
        this.usuario.nombre = user.displayName;
      }
      this.usuario.uid = user.uid;
    });
  }

  login(proveedor: string, email?: string, password?: string) {
    if (proveedor === 'google') {
      this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      console.log(proveedor);
    } else {
      return this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(email, password);
    }
  }

  logout() {
    this.usuario = {};
    this.afAuth.auth.signOut();
  }

  createUser(email: string, password: string) {
    return this.afAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(email, password);
  }

  cargarMensajes() {
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(5));
    return this.itemsCollection.valueChanges().pipe(map( mensajes => {
        this.chats = [];

        for (const mensaje of mensajes) {
          this.chats.unshift(mensaje);
        }

        return this.chats;
      }));
  }

  agregarMensaje(texto: string) {
    const mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    };
    // Devolvemos una promesa (then se ha completado) (catch ha dado error)
    return this.itemsCollection.add(mensaje);
  }

}
