import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app';

import { AuthOptions, User, AuthProvider} from './auth.types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuht: AngularFireAuth) { }

  authenticate({ isSignIn, provider, user}: AuthOptions): Promise<auth.UserCredential>{

    let operation: Promise<auth.UserCredential>

    if(provider !== AuthProvider.Email){
      operation = this.signInWithPopup(provider);
    } else {
      operation = isSignIn ? this.signInWithEmail(user) : this.signUpWithEmail(user);
    }

    return operation;

  }


  private signInWithEmail({ email, password }: User): Promise<auth.UserCredential> {
    return this.afAuht.auth.signInWithEmailAndPassword(email, password);
  }

  private signUpWithEmail({ email, password, name }: User): Promise<auth.UserCredential> {
    return this.afAuht.auth
      .createUserWithEmailAndPassword(email, password)
      .then(credencials => 
        credencials.user
        .updateProfile({ displayName: name, photoURL: null})
        .then(() => credencials)
        )
  }

  private signInWithPopup(provider: AuthProvider): Promise<auth.UserCredential> {
    let signInProvider = null;

    switch(provider){
      case AuthProvider.Facebook:
        signInProvider = new auth.FacebookAuthProvider();
      break;
    }

    return this.afAuht.auth.signInWithPopup(signInProvider);


  }
}
