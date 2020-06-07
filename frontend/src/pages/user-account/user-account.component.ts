import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GlobalConstantService } from '../../services/global-constant.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {
  @ViewChild('imageInput') imageInput: ElementRef;
  @ViewChild('userImage') userImage: ElementRef;
  @ViewChild('fOImage') fOImage: ElementRef;
  @ViewChild('aImage') aImage: ElementRef;

  dataUpdateForm: any;
  createFoundObjectForm: any;
  createAnnouncementForm: any;
  private navigationSubscription: Subscription;
  userDataIsSubmitted: boolean;
  announcementIsSubmitted: boolean;
  foundObjectIsSubmitted: boolean;

  constructor(private http: HttpClient, public constants: GlobalConstantService, private modalService: NgbModal,
              private firebaseAuth: AngularFireAuth, private formBuilder: FormBuilder,
              private router: Router, private notificationService: NotificationService) { }

  /**
   * Initialization of Component. Sets current role to guest and current action th login.
   * Subscribes the router action to get current modal
   */
  ngOnInit(): void {
    this.userDataIsSubmitted = false;
    this.announcementIsSubmitted = false;
    this.foundObjectIsSubmitted = false;

    this.createFoundObjectForm = this.formBuilder.group({
      title: ['', Validators.required],
      text: ['', Validators.required],
      question1: ['', Validators.required],
      question2: ['', Validators.required],
      question3: ['', Validators.required],
      answer1: ['', Validators.required],
      answer2: ['', Validators.required],
      answer3: ['', Validators.required]
    });

    this.createAnnouncementForm = this.formBuilder.group({
      title: ['', Validators.required],
      text: ['', Validators.required]
    });

    this.dataUpdateForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      nickName: [''],
      birthDate: ['', Validators.required],
      streetAddress: ['', Validators.required],
      zipCode: ['', Validators.required],
      city: ['Smart City'],
      phone: [''],
      email: ['', [Validators.required, Validators.email]]
    });

    this.refreshData();

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd && e.url === '/user-account') {
        this.refreshData();
      }
    });
  }
  // <editor-fold desc="Modal utility">

  /**
   * Refreshes the form validation depending on the current user -> Reset if no user is logged in
   */
  refreshData() {
    if (this.constants.userHasError){
      this.constants.getCurrentUserData();
    }

    if (this.constants.currentUser != null) {
      this.dataUpdateForm.setValue({
        firstName: this.constants.currentUser.firstName,
        lastName: this.constants.currentUser.lastName,
        nickName: this.constants.currentUser.nickName,
        birthDate: this.constants.currentUser.birthDate,
        streetAddress: this.constants.currentUser.streetAddress,
        zipCode: this.constants.currentUser.zipCode,
        city: 'Smart City',
        phone: this.constants.currentUser.phone,
        email: this.constants.currentUser.email
      });
    }
  }

  /**
   * Function to open the modal
   * @param modalContent Modal that should be opened
   */
  openModal(modalContent: any) {
    this.modalService.open(modalContent, {
      centered: true,
      scrollable: true
    });
  }

  /**
   * Function to open the modal
   * @param modalContent Modal that should be opened
   */
  openLargeModal(modalContent: any) {
    this.modalService.open(modalContent, {
      size: 'lg',
      centered: true,
      scrollable: true
    });
  }

  // </editor-fold>

  // <editor-fold desc="User actions">
  /**
   * Updates the currently logged in user after submitting the form within
   * the modal.
   */
  updateData() {
    this.userDataIsSubmitted = true;
    if (this.dataUpdateForm.valid) {
      const birthDateStr = new Date (this.dataUpdateForm.value.birthDate.year + '-' +
        this.dataUpdateForm.value.birthDate.month + '-' + this.dataUpdateForm.value.birthDate.day);

      const user = {
        uid: this.constants.firebaseUser.uid,
        firstName: this.dataUpdateForm.value.firstName,
        lastName: this.dataUpdateForm.value.lastName,
        nickName: this.dataUpdateForm.value.nickName,
        email: this.dataUpdateForm.value.email,
        birthDate: birthDateStr.toDateString(),
        streetAddress: this.dataUpdateForm.value.streetAddress,
        zipCode: this.dataUpdateForm.value.zipCode,
        phone: this.dataUpdateForm.value.phone
      };

      this.http.post(this.constants.host + '/user/update/' + this.constants.firebaseUser.uid,
        user).subscribe((val: any) => {
          if (val.status === 'success'){
            this.userDataIsSubmitted = false;
            this.firebaseAuth.currentUser.then(currentUser => {
              currentUser.reload().then(() => {
                this.constants.currentUser = currentUser;
              });
            });
            this.notificationService.showSuccess('Nutzerdaten wurden erfolgreich aktualisiert',
              'toast-top-left');
            this.modalService.dismissAll();
            this.refreshData();
          } else {
            this.notificationService.showError('Nutzerdaten konnten nicht aktualisiert werden. Bitte versuchen sie es später erneut.',
              'toast-top-center');
          }
        },
        error => {
          this.notificationService.showError('Nutzerdaten konnten nicht aktualisiert werden. Bitte versuchen sie es später erneut.',
            'toast-top-center');
        });
    }
  }

  /**
   * Deactivated the user account and signs out the currently logged in user
   */
  deactivateUserAndLogout() {
    this.http.post(this.constants.host + '/user/deactivate/' + this.constants.firebaseUser.uid,
      {}).subscribe((val: any) => {
        if (val.status === 'success'){
          this.modalService.dismissAll();
          this.constants.performLogout();
          this.refreshData();
          this.constants.authAction = 'login';
          this.router.navigate(['/home']);
        } else {
          this.notificationService.showError('Abmeldung ist fehlgeschlagen. Bitte versuchen sie es später erneut.',
            'toast-top-center');
        }
      },
      error => {
        this.notificationService.showError('Abmeldung ist fehlgeschlagen. Bitte versuchen sie es später erneut.',
          'toast-top-center');
      });
  }

  /**
   * Send a password reset mail to the user
   */
  resetPassword() {
    if (this.constants.firebaseUser != null) {
      this.firebaseAuth.sendPasswordResetEmail(this.constants.firebaseUser.email).then( result => {
        this.notificationService.showSuccess('Passwortreset E-Mail wurde versendet. Bitte prüfen Sie Ihre Mails', 'toast-top-left');
      }).catch(err => {
        this.notificationService.showError('Passwortreset E-Mail konnte nicht versendet werden', 'toast-top-left');
      });
    }
  }

  /**
   * Create new announcement from the user account page
   */
  createNewAnnouncement() {
    this.announcementIsSubmitted = true;
    if (this.createAnnouncementForm.valid) {
      const announcement = {
        title: this.createAnnouncementForm.value.title,
        text: this.createAnnouncementForm.value.text,
        type: 'announcement',
        source: 'Bürger',
        service: null,
        uid: this.constants.currentUser.uid,
        isActive: false,
        image: null
      };

      // todo add image while creating announcement
      /*
      if (this.aImage.nativeElement.files) {
        const file = this.aImage.nativeElement.files[0];
        if (file.type === 'image/jpeg' || 'image/png') {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            announcement.image = reader.result;
            this.sendAnnouncementToServer(announcement);
          };
        }
      } else {
        this.sendAnnouncementToServer(announcement);
      }*/
      this.sendAnnouncementToServer(announcement);
    }
  }

  /**
   * Send created announcement to backend server
   * @param foundObject Json object containing all data for announcement
   */
  sendAnnouncementToServer(announcement: any){
    this.http.post(this.constants.host + '/announcement/create',
      announcement).subscribe((val: any) => {
        if (val.status === 'success'){
          this.notificationService.showSuccess('Aushang wurde erstellt. Sobald er freigegeben wurde können Sie ihn unter Aushänge sehen.',
            'toast-top-left');
          this.announcementIsSubmitted = false;
          // todo reset file input
          this.createAnnouncementForm.setValue({
            title: '',
            text: ''
          });
          this.modalService.dismissAll();
        } else {
          this.notificationService.showError('Aushang konnte nicht erstellt werden. Bitte versuchen sie es später erneut.',
            'toast-top-left');
        }
      },
      error => {
        this.notificationService.showError('Aushang konnte nicht erstellt werden. Bitte versuchen sie es später erneut.',
          'toast-top-left');
      });
  }

  /**
   * Create new found item from the user account page
   */
  createNewFoundObject() {
    this.foundObjectIsSubmitted = true;
    if (this.createFoundObjectForm.valid) {
      const foundObject = {
        title: this.createFoundObjectForm.value.title,
        text: this.createFoundObjectForm.value.text,
        type: 'found object',
        source: 'Bürger',
        service: null,
        uid: this.constants.currentUser.uid,
        isActive: false,
        image: null,
        question1: this.createFoundObjectForm.value.question1,
        question2: this.createFoundObjectForm.value.question2,
        question3: this.createFoundObjectForm.value.question3,
        answer1: this.createFoundObjectForm.value.answer1,
        answer2: this.createFoundObjectForm.value.answer2,
        answer3: this.createFoundObjectForm.value.answer3
      };

      // todo add image while creating found object
      this.sendFoundObjectToServer(foundObject);
    }
  }

  /**
   * Send created found object to backend server
   * @param foundObject Json object containing all data for found object
   */
  sendFoundObjectToServer(foundObject: any){
    this.http.post(this.constants.host + '/foundObject/create',
      foundObject).subscribe((val: any) => {
        if (val.status === 'success'){
          this.notificationService.showSuccess('Fundgegenstand wurde erfolgreich abgegeben. Sobald er begutachtet wurde können Sie ihn unter Aushänge sehen.',
            'toast-top-left');
          // todo reset file input
          this.createFoundObjectForm.setValue({
            title: '',
            text: '',
            question1: '',
            question2: '',
            question3: '',
            answer1: '',
            answer2: '',
            answer3: '',
          });
          this.foundObjectIsSubmitted = false;
          this.modalService.dismissAll();
        } else {
          this.notificationService.showError('Fundgegenstand konnte nicht abgegeben werden. Bitte versuchen sie es später erneut.',
            'toast-top-left');
        }
      },
      error => {
        this.notificationService.showError('Fundgegenstand konnte nicht abgegeben werden. Bitte versuchen sie es später erneut.',
          'toast-top-left');
      });
  }

  /**
   * Upload a new image for the current logged in user
   */
  uploadImage(file: any) {
    if (file.type === 'image/jpeg' || 'image/png'){
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const updateObj = {
          image: reader.result
        };

        this.http.post(this.constants.host + '/user/image/' + this.constants.firebaseUser.uid,
          updateObj).subscribe((val: any) => {
            if (val.status === 'success'){
              this.notificationService.showSuccess('Nutzerbild wurde aktualisiert',
                'toast-top-left');
              this.userImage.nativeElement.src = reader.result;
            } else {
              this.notificationService.showError('Nutzerbild konnte nicht aktualisiert werden. Bitte versuchen sie es später erneut.',
                'toast-top-left');
            }
          },
          error => {
            this.notificationService.showError('Nutzerbild konnte nicht aktualisiert werden. Bitte versuchen sie es später erneut.',
              'toast-top-left');
          });
      };
    } else {
      this.notificationService.showError('Falsches Bildformat. Es werden nur JPEG und PNG Bilder unterstützt',
        'toast-top-left');
    }
  }

  // </editor-fold>

}
