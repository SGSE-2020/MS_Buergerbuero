import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';

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
  public maxVarcharLength = 255;
  public defaultImage: string;
  public defaultAnnouncementPreview: string;

  public activeAnnouncementList = [];
  public inActiveAnnouncementList = [];

  constructor(private firebaseAuth: AngularFireAuth, private http: HttpClient, private notificationService: NotificationService) {
    this.defaultImage = '../../assets/img/avatar.png';
    this.defaultAnnouncementPreview = '../assets/img/dummy_image.png';
  }

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
  public async getCurrentUserData(){
    const data = await this.http.get(this.host + '/user/' + this.firebaseUser.uid, {}).toPromise();
    const obj = JSON.parse(JSON.stringify(data));
    if (obj.status === 'success'){
      this.userHasError = false;
      this.userRole = obj.param.role;
      this.currentUser = obj.param;
      const birthDateResponse = new Date(this.currentUser.birthDate);
      this.currentUser.birthDate = {
        year: birthDateResponse.getFullYear(),
        month: birthDateResponse.getMonth() + 1,
        day: birthDateResponse.getDate()
      };
      if (this.currentUser.image == null || this.currentUser.image === ''){
        this.currentUser.image = this.defaultImage;
      }
    } else {
      this.notificationService.showWarning('Nutzerdaten konnten nicht abgerufen werden.',
        'toast-top-left');
      this.userHasError = true;
      this.currentUser = null;
    }
  }

  /**
   * Get all active announcements
   */
  public async getAllActiveAnnouncements(){
    const data = await this.http.get(this.host + '/announcement/active').toPromise();
    const obj = JSON.parse(JSON.stringify(data));
    if (obj.status === 'success'){
      return obj.param.announcements;
    } else {
      return [];
    }
  }

  /**
   * Get all inactive announcements
   */
  public async getAllInActiveAnnouncements(){
    const data = await this.http.get(this.host + '/announcement/inactive').toPromise();
    const obj = JSON.parse(JSON.stringify(data));
    if (obj.status === 'success'){
      return obj.param.announcements;
    } else {
      return [];
    }
  }
}
