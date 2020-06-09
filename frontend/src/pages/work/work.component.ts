import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import { GlobalConstantService } from '../../services/global-constant.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {HttpClient} from '@angular/common/http';
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit {
  currentAnnouncement: any;

  constructor(public constants: GlobalConstantService, private modalService: NgbModal, private http: HttpClient,
              private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getAllInActiveAnnouncements().then( result => {
      this.constants.inActiveAnnouncementList = result;
    });
  }

  /**
   * Get all inactive announcements
   */
  async getAllInActiveAnnouncements(){
    const data = await this.http.get(this.constants.host + '/announcement/inactive').toPromise();
    const obj = JSON.parse(JSON.stringify(data));
    if (obj.status === 'success'){
      return obj.param.announcements;
    } else {
      return [];
    }
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
          const elementIndex = this.constants.inActiveAnnouncementList.indexOf(this.currentAnnouncement);
          this.constants.inActiveAnnouncementList.splice(elementIndex, 1);

          const activeAnnouncement = this.currentAnnouncement;
          activeAnnouncement.isActive = true;
          this.constants.activeAnnouncementList.push(activeAnnouncement);
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
          const elementIndex = this.constants.inActiveAnnouncementList.indexOf(this.currentAnnouncement);
          this.constants.inActiveAnnouncementList.splice(elementIndex, 1);
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
