import { Component, OnInit } from '@angular/core';
import { GlobalConstantService } from '../../services/global-constant.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-black-board',
  templateUrl: './black-board.component.html',
  styleUrls: ['./black-board.component.css']
})
export class BlackBoardComponent implements OnInit {
  currentCreator: any;
  currentAnnouncement: any;
  receiveFoundObjectForm: any;

  allAnnouncements: any;

  constructor(public constants: GlobalConstantService, private modalService: NgbModal, private formBuilder: FormBuilder,
              private http: HttpClient, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.receiveFoundObjectForm = this.formBuilder.group({
      question1: ['', Validators.required],
      question2: ['', Validators.required],
      question3: ['', Validators.required]
    });

    this.getAllActiveAnnouncements().then( resultA => {
      this.constants.activeAnnouncementList = resultA;
      this.getAllInactiveAnnouncements().then( resultB => {
        this.constants.inActiveAnnouncementList = resultB;
        this.allAnnouncements = this.constants.activeAnnouncementList.concat(this.constants.inActiveAnnouncementList);
      });
    });

    this.currentCreator = null;
  }

  /**
   * Get all active announcements
   */
   async getAllActiveAnnouncements(){
     const data = await this.http.get(this.constants.host + '/announcement/active').toPromise();
     const obj = JSON.parse(JSON.stringify(data));
     if (obj.status === 'success'){
       return obj.param.announcements;
     } else {
       return [];
     }
  }

  /**
   * Get all in active announcements
   */
  async getAllInactiveAnnouncements(){
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
  async openDetailView(modalContent: any, announcement: any) {
    if (announcement.type === 'announcement'){
      if (announcement.uid != null && announcement.uid !== this.constants.currentUser?.uid){
        const data = await this.http.get(this.constants.host + '/user/' + announcement.uid, {}).toPromise();
        const obj = JSON.parse(JSON.stringify(data));
        if (obj.status === 'success'){
          this.currentCreator = obj.param;
        } else {
          this.currentCreator = null;
        }
      } else if (announcement.uid == null){
        this.currentCreator = {
          nickName: announcement.service
        };
      } else {
        this.currentCreator = this.constants.currentUser;
      }
    } else {
      this.currentCreator = null;
    }

    this.modalService.open(modalContent, {
      size: 'xl',
      centered: true,
      scrollable: true
    });
    this.currentAnnouncement = announcement;
  }

  /**
   * Function to receive a found object
   */
  receiveFoundObject() {
    // todo check if validation is okay
    // todo if successful remove announcement
  }

  /**
   * Open confirmation Modal
   */
  openDeletionConfirmation(modalContent: any, announcement) {
    this.modalService.open(modalContent, {
      centered: true,
      scrollable: true
    });
    this.currentAnnouncement = announcement;
  }

  /**
   * Delete announcement permanently
   */
  confirmDeletion() {
    this.http.delete(this.constants.host + '/announcement/' + this.currentAnnouncement.id,
      {}).subscribe((val: any) => {
        if (val.status === 'success'){
          const elementIndexA = this.allAnnouncements.indexOf(this.currentAnnouncement);
          this.allAnnouncements.splice(elementIndexA, 1);
          const elementIndexB = this.constants.activeAnnouncementList.indexOf(this.currentAnnouncement);
          this.constants.activeAnnouncementList.splice(elementIndexB, 1);
          this.notificationService.showSuccess('Aushang wurde gelöscht.',
            'toast-top-center');
          this.modalService.dismissAll();
        } else {
          this.notificationService.showSuccess('Aushang konte nicht gelöscht werden. Bitte versuchen Sie es später erneut.',
          'toast-top-center');
        }
      },
      error => {
        this.notificationService.showSuccess('Aushang konte nicht gelöscht werden. Bitte versuchen Sie es später erneut.',
          'toast-top-center');
      });
  }

  /**
   * Send email to user who created an announcement
   */
  mailTo() {
    const mail = document.createElement('a');
    mail.href = 'mailto:abc@abc.com?subject=files&body=Hi';
    mail.href = 'mailto:' + this.currentCreator.email + '?subject=' + this.currentAnnouncement.title;
    mail.click();
  }



}
