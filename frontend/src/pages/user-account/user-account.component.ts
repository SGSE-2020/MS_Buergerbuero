import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { GlobalConstantService } from '../../services/global-constant.service';
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

  announcementFormImage: any;
  foundObjectFormImage: any;

  maxFileSize: any;

  constructor(private http: HttpClient, public constants: GlobalConstantService, private modalService: NgbModal,
              private firebaseAuth: AngularFireAuth, private formBuilder: FormBuilder,
              private router: Router, private notificationService: NotificationService) { }


  /**
   * Initialization of Component. Sets current role to guest and current action th login.
   * Subscribes the router action to get current modal
   */
  ngOnInit(): void {
    this.maxFileSize = 9214644; // 9.214.643,25‬ = 9MB
    this.announcementFormImage = this.constants.defaultAnnouncementPreview;
    this.foundObjectFormImage = this.constants.defaultAnnouncementPreview;
    this.userDataIsSubmitted = false;
    this.announcementIsSubmitted = false;
    this.foundObjectIsSubmitted = false;

    this.createFoundObjectForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(this.constants.maxVarcharLength)]],
      text: ['', Validators.required],
      question1: ['', [Validators.required, Validators.maxLength(this.constants.maxVarcharLength)]],
      question2: ['', [Validators.required, Validators.maxLength(this.constants.maxVarcharLength)]],
      question3: ['', [Validators.required, Validators.maxLength(this.constants.maxVarcharLength)]],
      answer1: ['', [Validators.required, Validators.maxLength(this.constants.maxVarcharLength)]],
      answer2: ['', [Validators.required, Validators.maxLength(this.constants.maxVarcharLength)]],
      answer3: ['', [Validators.required, Validators.maxLength(this.constants.maxVarcharLength)]]
    });

    this.createAnnouncementForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(this.constants.maxVarcharLength)]],
      text: ['', Validators.required]
    });

    this.dataUpdateForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(this.constants.maxVarcharLength)]],
      lastName: ['', [Validators.required, Validators.maxLength(this.constants.maxVarcharLength)]],
      nickName: ['', Validators.maxLength(this.constants.maxVarcharLength)],
      birthDate: ['', Validators.required],
      streetAddress: ['', [Validators.required, Validators.maxLength(this.constants.maxVarcharLength)]],
      zipCode: ['', [Validators.required, Validators.maxLength(5)]],
      city: ['Smart City'],
      phone: ['', Validators.maxLength(this.constants.maxVarcharLength)],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(this.constants.maxVarcharLength)]]
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

    if (this.constants.firebaseUser != null) {
      if (this.constants.currentUser == null){
        this.constants.getCurrentUserData().then(() => {
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
        });
      } else {
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

      this.http.put(this.constants.host + '/user/' + this.constants.firebaseUser.uid,
        user).subscribe((val: any) => {
          if (val.status === 'success'){
            this.userDataIsSubmitted = false;
            this.firebaseAuth.currentUser.then(currentUser => {
              currentUser.reload().then(() => {
                this.constants.firebaseUser = currentUser;
                this.constants.getCurrentUserData().then(result => {
                  this.refreshData();
                });
              });
            });
            this.notificationService.showSuccess('Nutzerdaten wurden erfolgreich aktualisiert',
              'toast-top-left');
            this.modalService.dismissAll();
            this.refreshData();
          } else {
            this.notificationService.showError('Nutzerdaten konnten nicht aktualisiert werden. Bitte versuchen Sie es später erneut.',
              'toast-top-center');
          }
        },
        error => {
          this.notificationService.showError('Nutzerdaten konnten nicht aktualisiert werden. Bitte versuchen Sie es später erneut.',
            'toast-top-center');
        });
    }
  }

  /**
   * Deactivated the user account and signs out the currently logged in user
   */
  deactivateUserAndLogout() {
    this.http.delete(this.constants.host + '/user/' + this.constants.firebaseUser.uid,
      {}).subscribe((val: any) => {
        if (val.status === 'success'){
          this.modalService.dismissAll();
          this.constants.performLogout();
          this.refreshData();
          this.constants.authAction = 'login';
          this.router.navigate(['/home']);
        } else {
          this.notificationService.showError('Abmeldung ist fehlgeschlagen. Bitte versuchen Sie es später erneut.',
            'toast-top-center');
        }
      },
      error => {
        this.notificationService.showError('Abmeldung ist fehlgeschlagen. Bitte versuchen Sie es später erneut.',
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
      const imageStr = this.announcementFormImage === this.constants.defaultAnnouncementPreview ? null : this.announcementFormImage;
      const announcement = {
        title: this.createAnnouncementForm.value.title,
        text: this.createAnnouncementForm.value.text,
        type: 'announcement',
        source: 'Bürger',
        service: null,
        uid: this.constants.currentUser.uid,
        isActive: false,
        image: imageStr
      };

      this.sendAnnouncementToServer(announcement);
    }
  }

  /**
   * Send created announcement to backend server
   * @param foundObject Json object containing all data for announcement
   */
  sendAnnouncementToServer(announcement: any){
    this.http.post(this.constants.host + '/announcement/',
      announcement).subscribe((val: any) => {
        if (val.status === 'success'){
          this.notificationService.showSuccess('Aushang wurde erstellt. Sobald er freigegeben wurde können Sie ihn unter Aushänge sehen.',
            'toast-top-left');
          this.announcementIsSubmitted = false;
          this.announcementFormImage = this.constants.defaultAnnouncementPreview;
          if (this.aImage !== undefined){
            this.aImage.nativeElement.value = '';
          }
          this.createAnnouncementForm.setValue({
            title: '',
            text: ''
          });
          this.modalService.dismissAll();
        } else {
          this.notificationService.showError('Aushang konnte nicht erstellt werden. Bitte versuchen Sie es später erneut.',
            'toast-top-left');
        }
      },
      error => {
        this.notificationService.showError('Aushang konnte nicht erstellt werden. Bitte versuchen Sie es später erneut.',
          'toast-top-left');
      });
  }

  /**
   * Udate image preview in announcement creation modal
   * @param fileInput File that should be converted to base64 and shown in the preview
   */
  updateAnnouncementPreview(fileInput: any) {
    const announcementImage = fileInput[0];
    if (announcementImage){
      if (announcementImage.type === 'image/jpeg' || 'image/png') {
        if (announcementImage.size < this.maxFileSize){
          const reader = new FileReader();
          reader.readAsDataURL(announcementImage);
          reader.onload = () => {
            this.announcementFormImage = reader.result;
          };
        } else {
          this.notificationService.showError('Bild ist zu groß. Es werden maximal 9MB unterstützt.',
            'toast-top-center');
        }
      } else {
        this.notificationService.showError('Falsches Bildformat. Es werden nur JPEG und PNG Bilder unterstützt',
          'toast-top-center');
      }
    }
  }

  /**
   * Remove image from announcement creation modal
   */
  removeAnnouncementPreview() {
    this.announcementFormImage = this.constants.defaultAnnouncementPreview;
    if (this.aImage !== undefined){
      this.aImage.nativeElement.value = '';
    }
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
      this.sendFoundObjectToServer(foundObject);
    }
  }

  /**
   * Send created found object to backend server
   * @param foundObject Json object containing all data for found object
   */
  sendFoundObjectToServer(foundObject: any){
    this.http.post(this.constants.host + '/foundObject/',
      foundObject).subscribe((val: any) => {
        if (val.status === 'success'){
          this.notificationService.showSuccess('Fundgegenstand wurde erfolgreich abgegeben. Sobald er begutachtet wurde können Sie ihn unter Aushänge sehen.',
            'toast-top-left');
          this.foundObjectFormImage = this.constants.defaultAnnouncementPreview;
          if (this.fOImage !== undefined){
            this.fOImage.nativeElement.value = '';
          }
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
          this.notificationService.showError('Fundgegenstand konnte nicht abgegeben werden. Bitte versuchen Sie es später erneut.',
            'toast-top-left');
        }
      },
      error => {
        this.notificationService.showError('Fundgegenstand konnte nicht abgegeben werden. Bitte versuchen Sie es später erneut.',
          'toast-top-left');
      });
  }

  /**
   * Udate image preview in found object creation modal
   * @param fileInput File that should be converted to base64 and shown in the preview
   */
  updateFoundObjectPreview(fileInput: any) {
    if (fileInput[0]){
      if (fileInput[0].type === 'image/jpeg' || 'image/png') {
        if (fileInput[0].size < this.maxFileSize){
          const reader = new FileReader();
          reader.readAsDataURL(fileInput[0]);
          reader.onload = () => {
            this.foundObjectFormImage = reader.result;
          };
        } else {
          this.notificationService.showError('Bild ist zu groß. Es werden maximal 9MB unterstützt.',
            'toast-top-center');
        }
      } else {
        this.notificationService.showError('Falsches Bildformat. Es werden nur JPEG und PNG Bilder unterstützt',
          'toast-top-center');
      }
    }
  }

  /**
   * Remove image from found object creation modal
   */
  removeFoundObjectPreview() {
    this.foundObjectFormImage = this.constants.defaultAnnouncementPreview;
    if (this.fOImage !== undefined){
      this.fOImage.nativeElement.value = '';
    }
  }

  /**
   * Upload a new image for the current logged in user
   */
  uploadImage(file: any) {
    if (file.type === 'image/jpeg' || file.type === 'image/png'){
      if (file.size < this.maxFileSize){
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const updateObj = {
            image: reader.result
          };
          this.http.put(this.constants.host + '/user/image/' + this.constants.firebaseUser.uid,
            updateObj).subscribe((val: any) => {
              if (val.status === 'success'){
                this.notificationService.showSuccess('Nutzerbild wurde aktualisiert',
                  'toast-top-left');
                this.constants.currentUser.image = reader.result;
              } else {
                this.notificationService.showError('Nutzerbild konnte nicht aktualisiert werden. Bitte versuchen Sie es später erneut.',
                  'toast-top-left');
              }
            },
            error => {
              this.notificationService.showError('Nutzerbild konnte nicht aktualisiert werden. Bitte versuchen Sie es später erneut.',
                'toast-top-left');
            });
        };
      } else {
        this.notificationService.showError('Bild ist zu groß. Es werden maximal 9MB unterstützt.',
          'toast-top-left');
      }
    } else {
      this.notificationService.showError('Falsches Bildformat. Es werden nur JPEG und PNG Bilder unterstützt',
        'toast-top-left');
    }
  }

  /**
   * Remove uploaded image from user and replace it with a default one in view
   */
  removeImage() {
    this.http.delete(this.constants.host + '/user/image/' +
      this.constants.firebaseUser.uid).subscribe((val: any) => {
        if (val.status === 'success'){
          this.constants.currentUser.image = this.constants.defaultImage;
        } else {
          this.notificationService.showError('Nutzerbild konnte nicht entfernt werden. Bitte versuchen Sie es später erneut.',
            'toast-top-center');
        }
      },
      error => {
        this.notificationService.showError('Nutzerbild konnte nicht entfernt werden. Bitte versuchen Sie es später erneut.',
          'toast-top-center');
      });
  }
  // </editor-fold>


}
