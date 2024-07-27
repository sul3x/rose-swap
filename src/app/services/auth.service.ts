import {Injectable} from '@angular/core';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user} from "@angular/fire/auth";
import {User} from "@firebase/auth-types";
import {BehaviorSubject, Observable, of, switchMap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userIdSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public userId$: Observable<string | null> = this.userIdSubject.asObservable();

  constructor(private auth: Auth) {
    this.auth.onAuthStateChanged((user: User | null) => {
      this.userIdSubject.next(user ? user.uid : null);
    });
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

  getUserId2(): Observable<string | null> {
    return this.userId$;
  }

  getUserId(): Observable<string | null> {
    return user(this.auth).pipe(
      switchMap((authUser: User | null) => {
        if (authUser) {
          return of(authUser.uid);
        } else {
          return of(null);
        }
      })
    );
  }
}

