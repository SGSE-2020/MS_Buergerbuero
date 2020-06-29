import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { GlobalConstantService } from '../../services/global-constant.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-black-board',
  templateUrl: './black-board.component.html',
  styleUrls: ['./black-board.component.css']
})
export class BlackBoardComponent implements OnInit {
  currentCreator: any;
  currentAnnouncement: any;
  receiveFoundObjectForm: any;
  receiveFoundObjectFormSubmitted: boolean;

  announcementList: any;
  foundObjectList: any;
  userAnnouncements: any;

  private navigationSubscription: Subscription;
  constructor(public constants: GlobalConstantService, private modalService: NgbModal, private formBuilder: FormBuilder,
              private http: HttpClient, private notificationService: NotificationService,  private router: Router) { }

  ngOnInit(): void {
    this.announcementList = [];
    this.foundObjectList = [];
    this.userAnnouncements = [];
    this.receiveFoundObjectFormSubmitted = false;
    this.receiveFoundObjectForm = this.formBuilder.group({
      question1: ['', Validators.required],
      question2: ['', Validators.required],
      question3: ['', Validators.required]
    });

    this.currentCreator = null;
    this.refreshData();

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd && e.url === '/black-board') {
        this.refreshData();
      }
    });
  }

  /**
   * Track by function for component lists
   * @param index Index of array
   * @param announcement announcement
   */
  trackByObj(index: number, announcement: any) {
    return announcement;
  }

  /**
   * Refreshes the form validation depending on the current user -> Reset if no user is logged in
   */
  refreshData() {
    if (this.constants.firebaseUser != null){
      this.constants.getAllAnnouncements().then(res => {
        this.userAnnouncements = res.filter(x => x.uid === this.constants.firebaseUser.uid);
      });
    } else {
      this.userAnnouncements = [];
    }

    this.constants.getAllActiveAnnouncements().then(res => {
      this.announcementList = res.filter(x => x.type === 'announcement');
      this.foundObjectList = res.filter(x => x.type === 'found object');
    });
  }

  /**
   * Open detail view of clicked announcement
   * @param modalContent announcementDetail modal
   * @param announcement Announcement that was selected
   */
  async openDetailView(modalContent: any, announcement: any) {
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
    this.receiveFoundObjectFormSubmitted = true;
    if (this.receiveFoundObjectForm.valid){
      const validationObj = {
        answer1: this.receiveFoundObjectForm.value.question1,
        answer2: this.receiveFoundObjectForm.value.question2,
        answer3: this.receiveFoundObjectForm.value.question3
      };
      this.http.post(this.constants.host + '/announcement/receive/' + this.currentAnnouncement.id,
        validationObj).subscribe((val: any) => {
          if (val.status === 'success'){
            this.receiveFoundObjectFormSubmitted = false;
            const elementIndex = this.foundObjectList.indexOf(this.currentAnnouncement);
            if (elementIndex !== -1){
              this.foundObjectList.splice(elementIndex, 1);
            }
            const elementIndexUser = this.userAnnouncements.indexOf(this.currentAnnouncement);
            if (elementIndexUser !== -1){
              this.userAnnouncements.splice(elementIndexUser, 1);
            }
            this.notificationService.showSuccess('Fundgegenstand wurde erfolgreich abgeholt.',
              'toast-top-left');
            this.modalService.dismissAll();
          } else {
            this.notificationService.showWarning('Validierung fehlgeschlagen. Bitte trage die korrekten Antworten ein, wenn der Gegenstand wirklich dir gehört.',
              'toast-top-center');
          }
        },
        error => {
          this.notificationService.showError('Fundgegenstand konnte nicht abgeholt werden. Bitte versuchen Sie es später erneut.',
            'toast-top-center');
        });
    }
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
          let removeIndex;
          if (this.currentAnnouncement.type === 'announcement'){
            removeIndex = this.announcementList.map(item => {
              return item.id;
            }).indexOf(this.currentAnnouncement.id);
            if (removeIndex !== -1){
              this.announcementList.splice(removeIndex, 1);
            }
          } else {
            removeIndex = this.foundObjectList.map(item => {
              return item.id;
            }).indexOf(this.currentAnnouncement.id);
            if (removeIndex !== -1){
              this.foundObjectList.splice(removeIndex, 1);
            }
          }
          removeIndex = this.userAnnouncements.map(item => {
            return item.id;
          }).indexOf(this.currentAnnouncement.id);
          if (removeIndex !== -1){
            this.userAnnouncements.splice(removeIndex, 1);
          }
          this.notificationService.showSuccess('Aushang wurde gelöscht.',
            'toast-top-left');
          this.modalService.dismissAll();
        } else {
          this.notificationService.showError('Aushang konte nicht gelöscht werden. Bitte versuchen Sie es später erneut.',
          'toast-top-left');
        }
      },
      error => {
        this.notificationService.showError('Aushang konte nicht gelöscht werden. Bitte versuchen Sie es später erneut.',
          'toast-top-left');
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

  /**
   * Open PDF of announcement in new tab to print or download
   * @param currentAnnouncement current announcement to print
   */
  printAnnouncement(currentAnnouncement: any) {
    const documentDefinition = {
      content: [],
      styles: {
        header: {
          fontSize: 22,
          bold: true
        }
      }
    };
    const titleObj = {
      text: currentAnnouncement.title,
      style: 'header'
    };
    documentDefinition.content.push(titleObj);
    if (currentAnnouncement.image != null){
      const imgObj = {
        image: currentAnnouncement.image,
        width: 500,
        margin: [0, 10, 0, 0]
      };
      documentDefinition.content.push(imgObj);

    }
    const textObj = {
      text: currentAnnouncement.text,
      margin: [0, 10, 0, 0]
    };
    documentDefinition.content.push(textObj);
    const fileName = currentAnnouncement.title + '.pdf';
    pdfMake.createPdf(documentDefinition).download(fileName);
  }
}
