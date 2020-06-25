import { Component, OnInit } from '@angular/core';
import { GlobalConstantService } from '../../services/global-constant.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {Subscription} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

  allAnnouncements: any;
  activeAnnouncements: any;

  private navigationSubscription: Subscription;
  constructor(public constants: GlobalConstantService, private modalService: NgbModal, private formBuilder: FormBuilder,
              private http: HttpClient, private notificationService: NotificationService,  private router: Router) { }

  ngOnInit(): void {
    this.allAnnouncements = [];
    this.activeAnnouncements = [];
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
  **
  * Refreshes the form validation depending on the current user -> Reset if no user is logged in
  */
  refreshData() {
    this.constants.getAllAnnouncements().then(res => {
      this.allAnnouncements = res;
    });

    this.constants.getAllActiveAnnouncements().then(res => {
      this.activeAnnouncements = res;
    });
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
            const elementIndexA = this.allAnnouncements.indexOf(this.currentAnnouncement);
            this.allAnnouncements.splice(elementIndexA, 1);
            const elementIndexB = this.activeAnnouncements.indexOf(this.currentAnnouncement);
            this.activeAnnouncements.splice(elementIndexB, 1);
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
          const elementIndexA = this.allAnnouncements.indexOf(this.currentAnnouncement);
          this.allAnnouncements.splice(elementIndexA, 1);
          const elementIndexB = this.activeAnnouncements.indexOf(this.currentAnnouncement);
          this.activeAnnouncements.splice(elementIndexB, 1);
          this.notificationService.showSuccess('Aushang wurde gelöscht.',
            'toast-top-center');
          this.modalService.dismissAll();
        } else {
          this.notificationService.showError('Aushang konte nicht gelöscht werden. Bitte versuchen Sie es später erneut.',
          'toast-top-center');
        }
      },
      error => {
        this.notificationService.showError('Aushang konte nicht gelöscht werden. Bitte versuchen Sie es später erneut.',
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

    pdfMake.createPdf(documentDefinition).open();
  }
}
