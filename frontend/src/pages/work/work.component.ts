import {Component, OnInit } from '@angular/core';
import { GlobalConstantService } from '../../services/global-constant.service';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit {
  currentAnnouncement: any;
  inactiveAnnouncements: any;

  private navigationSubscription: Subscription;
  constructor(public constants: GlobalConstantService, private modalService: NgbModal, private http: HttpClient,
              private notificationService: NotificationService, private router: Router) { }

  ngOnInit(): void {
    this.inactiveAnnouncements = [];
    this.refreshData();

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd && e.url === '/work') {
        this.refreshData();
      }
    });
  }


  /**
   * Refreshes the form validation depending on the current user -> Reset if no user is logged in
   */
  refreshData() {
    this.constants.getAllInactiveAnnouncements().then( result => {
      this.inactiveAnnouncements  = result;
    });
  }

  /**
   * Open detail view of clicked announcement
   * @param modalContent announcementDetail modal
   * @param announcement Announcement that was selected
   */
  openDetailView(modalContent: any, announcement: any) {
    this.modalService.open(modalContent, {
      size: 'xl',
      centered: true,
      scrollable: true
    });
    this.currentAnnouncement = announcement;
  }

  /**
   * Activate an created announcement
   * @param announcement Announcement which should be activated
   */
  activateAnnouncement(announcement: any) {
    this.http.put(this.constants.host + '/announcement/activate/' +
      announcement.id, {}).subscribe((val: any) => {
        if (val.status === 'success'){
          const elementIndex = this.inactiveAnnouncements.indexOf(this.currentAnnouncement);
          this.inactiveAnnouncements.splice(elementIndex, 1);
          this.notificationService.showSuccess('Aushang wurde erfolgreich abgelehnt.',
            'toast-top-left');
          this.modalService.dismissAll();
        } else {
          this.notificationService.showError('Deaktivieren des Aushangs nicht möglich. Bitte versuchen Sie es später erneut.',
            'toast-top-left');
        }
      },
      error => {
        this.notificationService.showError('Deaktivieren des Aushangs nicht möglich. Bitte versuchen Sie es später erneut.',
          'toast-top-left');
      });
  }

  /**
   * Delete an created announcement
   * @param announcement Announcement which should be deactivated
   */
  deleteAnnouncement() {
    this.http.delete(this.constants.host + '/announcement/' +
      this.currentAnnouncement.id, {}).subscribe((val: any) => {
        if (val.status === 'success'){
          const elementIndex = this.inactiveAnnouncements.indexOf(this.currentAnnouncement);
          this.inactiveAnnouncements.splice(elementIndex, 1);
          this.notificationService.showSuccess('Aushang wurde erfolgreich abgelehnt.',
            'toast-top-left');
          this.modalService.dismissAll();
        } else {
          this.notificationService.showError('Entfernen des Aushangs nicht möglich. Bitte versuchen Sie es später erneut.',
            'toast-top-left');
        }
      },
      error => {
        this.notificationService.showError('Entfernen des Aushangs nicht möglich. Bitte versuchen Sie es später erneut.',
          'toast-top-left');
      });
  }

  /**
   * Open confirmation Modal
   */
  openDeletionConfirmation(modalContent: any, announcement: any) {
    this.modalService.open(modalContent, {
      centered: true,
      scrollable: true
    });
    this.currentAnnouncement = announcement;
  }
}
