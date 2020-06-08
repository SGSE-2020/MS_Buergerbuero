import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalConstantService } from '../../services/global-constant.service';
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  usersList: any;
  constructor(private http: HttpClient, public constants: GlobalConstantService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.usersList = [];
    this.getAllUsers().then( result => {
      this.usersList = result;
    });
  }

  /**
   * Get all users
   */
  async getAllUsers(){
    const data = await this.http.get(this.constants.host + '/user').toPromise();
    const obj = JSON.parse(JSON.stringify(data));
    if (obj.status === 'success'){
      return obj.param.users;
    } else {
      return [];
    }
  }

  /**
   * Upgrade user role from the user
   */
  upgradeUser(user: any) {
    if (user.uid !== this.constants.firebaseUser.uid){
      if (user.role < 3){
        const obj = {
          role: user.role + 1
        };
        this.http.put(this.constants.host + '/user/role/' + user.uid,
          obj).subscribe((val: any) => {
            if (val.status === 'success'){
              const elementIndex = this.usersList.indexOf(user);
              this.usersList[elementIndex].role = user.role + 1;
              this.notificationService.showSuccess('Nutzerrolle wurde erfolgreich geändert.',
                'toast-top-left');
            } else {
              this.notificationService.showError('Nutzerrolle konnte nicht aktualisiert werden. Bitte versuchen Sie es später erneut.',
                'toast-top-left');
            }
          },
          error => {
            this.notificationService.showError('Nutzerrolle konnte nicht aktualisiert werden. Bitte versuchen Sie es später erneut.',
              'toast-top-left');
          });
      } else {
        this.notificationService.showError('Nutzer hat bereits die höchste Rolle.',
          'toast-top-left');
      }
    } else {
      this.notificationService.showError('Sie können nicht Ihre eigene Rolle ändern.',
        'toast-top-left');
    }
  }

  /**
   * Upgrade user role from the user
   */
  downgradeUser(user: any) {
    if (user.uid !== this.constants.firebaseUser.uid){
      if (user.role > 1){
        const obj = {
          role: user.role - 1
        };
        this.http.put(this.constants.host + '/user/role/' + user.uid,
          obj).subscribe((val: any) => {
            if (val.status === 'success'){
              const elementIndex = this.usersList.indexOf(user);
              this.usersList[elementIndex].role = user.role - 1;
              this.notificationService.showSuccess('Nutzerrolle wurde erfolgreich geändert.',
                'toast-top-left');
            } else {
              this.notificationService.showError('Nutzerrolle konnte nicht aktualisiert werden. Bitte versuchen Sie es später erneut.',
                'toast-top-left');
            }
          },
          error => {
            this.notificationService.showError('Nutzerrolle konnte nicht aktualisiert werden. Bitte versuchen Sie es später erneut.',
              'toast-top-left');
          });
      } else {
        this.notificationService.showError('Nutzer hat bereits die höchste Rolle.',
          'toast-top-left');
      }
    } else {
      this.notificationService.showError('Sie können nicht Ihre eigene Rolle ändern.',
        'toast-top-left');
    }
  }
}
