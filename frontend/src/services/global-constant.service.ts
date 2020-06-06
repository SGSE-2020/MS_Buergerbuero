import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {HttpClient} from '@angular/common/http';
import {NotificationService} from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalConstantService {
  public host = 'http://localhost:8080';
  // public host = '/api';

  public authAction = 'login';
  public firebaseUser = null;
  public currentUser = null;
  public userRole = 0;
  public userHasError = false;

  constructor(private firebaseAuth: AngularFireAuth, private http: HttpClient, private notificationService: NotificationService) { }

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

  /**
   * Get current userdata
   */
  getCurrentUserData(){
    this.http.get(this.host + '/user/' + this.firebaseUser.uid, {}).subscribe(
      (val: any) => {
        if (val.status === 'success'){
          this.userHasError = false;
          this.currentUser = val.param;
          const birthDateResponse = new Date(this.currentUser.birthDate);
          this.currentUser.birthDate = {
            year: birthDateResponse.getFullYear(),
            month: birthDateResponse.getMonth() + 1,
            day: birthDateResponse.getDate()
          };
        } else {
          this.notificationService.showWarning('Nutzerdaten konnten nicht abgerufen werden. Datenbank möglicherweise nicht verfügbar.',
            'toast-top-left');
          this.userHasError = true;
          this.currentUser = {
            gender: 1,
            firstName: 'Nicht verfügbar',
            lastName: '',
            nickName: 'Nicht verfügbar',
            email: 'Nicht verfügbar',
            password: 'Nicht verfügbar',
            birthDate: '',
            streetAddress: 'Nicht verfügbar',
            zipCode: '',
            phone: 'Nicht verfügbar'
          };

          const birthDateResponse = new Date('01.01.1900');
          this.currentUser.birthDate = {
            year: birthDateResponse.getFullYear(),
            month: birthDateResponse.getMonth() + 1,
            day: birthDateResponse.getDate()
          };
        }
      },
      error => {
        this.notificationService.showError('Es ist ein Fehler aufgetreten. Bitte versuchen sie es später erneut',
          'toast-top-left');
      });
  }
}
