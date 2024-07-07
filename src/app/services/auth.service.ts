import {Injectable} from '@angular/core';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) {
  }

  async register({email, password}: { email: string; password: string }) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(userCredential => userCredential)
      .catch(error => {
        console.log(`Registration error: ${error}`)
        return null
      });
  }

  async login({email, password}: { email: string; password: string }) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(userCredential => userCredential)
      .catch(error => {
        console.log(`Login error: ${error}`)
        return null
      });
  }

  logout(){
    return signOut(this.auth)
  }
}
