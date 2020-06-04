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

  dataUpdateForm: any;
  createFoundObjectForm: any;
  createAnnouncementForm: any;
  private navigationSubscription: Subscription;

  constructor(private http: HttpClient, public constants: GlobalConstantService, private modalService: NgbModal,
              private firebaseAuth: AngularFireAuth, private formBuilder: FormBuilder,
              private router: Router, private notificationService: NotificationService) { }

  /**
   * Initialization of Component. Sets current role to guest and current action th login.
   * Subscribes the router action to get current modal
   */
  ngOnInit(): void {
    this.createFoundObjectForm = this.formBuilder.group({
      // todo to be defined
    });

    this.createAnnouncementForm = this.formBuilder.group({
      // todo to be defined
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

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
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

  // </editor-fold>

  // <editor-fold desc="User actions">
  /**
   * Updates the currently logged in user after submitting the form within
   * the modal.
   */
  updateData() {
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

      this.http.post('http://' + this.constants.host + ':' + this.constants.backendPort + '/user/update/' + this.constants.firebaseUser.uid,
        user).subscribe((val: any) => {
          if (val.status === 'success'){
            this.notificationService.showSuccess('Nutzerdaten wurden erfolgreich aktualisiert',
              'toast-top-left');
            this.modalService.dismissAll();
            this.constants.currentUser.firstName = this.dataUpdateForm.value.firstName;
            this.constants.currentUser.lastName = this.dataUpdateForm.value.lastName;
            this.constants.currentUser.nickName = this.dataUpdateForm.value.nickName;
            this.constants.currentUser.email = this.dataUpdateForm.value.email;
            this.constants.currentUser.birthDate = this.dataUpdateForm.value.birthDate;
            this.constants.currentUser.streetAddress = this.dataUpdateForm.value.streetAddress;
            this.constants.currentUser.zipCode = this.dataUpdateForm.value.zipCode;
            this.constants.currentUser.phone = this.dataUpdateForm.value.phone;
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
    this.http.post('http://' + this.constants.host + ':' + this.constants.backendPort + '/user/deactivate/' + this.constants.firebaseUser.uid,
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
    if (this.createAnnouncementForm.valid) {
      // todo create announcement
    }
  }

  /**
   * Create new found item from the user account page
   */
  createNewFoundItem() {
    if (this.createFoundObjectForm.valid) {
      // todo create found item
    }
  }

  /**
   * Upload a new image for the current logged in user
   */
  uploadImage(file: any) {
    // todo upload image for current user
    if (file.type === 'image/jpeg' || 'image/png'){
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const updateObj = {
          image: reader.result
        };

        this.http.post('http://' + this.constants.host + ':' + this.constants.backendPort + '/user/image/' + this.constants.firebaseUser.uid,
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
