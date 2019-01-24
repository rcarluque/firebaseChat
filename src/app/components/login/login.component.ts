import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../providers/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  email: string;
  pass: string;
  showUsuario = false;
  // True login, False new
  opcion: boolean = undefined;

  // prueba
  err = {};

  constructor(public chatSevice: ChatService) { }

  ngOnInit() {
  }

  login(proveedor?: string) {
    this.chatSevice.login(proveedor);
  }

  userActions() {
    if (this.opcion) {
      this.chatSevice.login('default', this.email, this.pass)
        .then( () => this.err = {} )
        .catch( err => {
          console.error(err);
          this.err = err;
          this.pass = '';
        });
    } else {
      this.chatSevice.createUser(this.email, this.pass)
        .then( () => this.err = {} )
        .catch( err => {
          console.error(err.message);
          this.err = err;
          this.pass = '';
        });
    }
  }

}
