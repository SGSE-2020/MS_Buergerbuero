import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class GlobalConstantsService {
  public host = 'localhost';
  // public host = 'backend';

  public authAction = 'login';
  public firebaseUser = null;
  public currentUser = null;
  public userRole = 0;

  constructor(private firebaseAuth: AngularFireAuth) { }

  /**
   * Logout the current signed in user and set the role to guest
   */
  public performLogout() {
    this.firebaseAuth.signOut().then((result) => {
      this.firebaseUser = null;
      this.currentUser = null;
      this.userRole = 0;
      this.authAction = 'login';
    });
  }
}
