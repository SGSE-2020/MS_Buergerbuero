import { Component, OnInit } from '@angular/core';
import { GlobalConstantsService } from '../../app/global-constants.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {
  dataUpdateForm: any;
  createFoundObjectForm: any;
  createAnnouncementForm: any;
  private navigationSubscription: Subscription;

  constructor(private http: HttpClient, public constants: GlobalConstantsService, public modalService: NgbModal,
              private firebaseAuth: AngularFireAuth, private formBuilder: FormBuilder,
              private router: Router) { }

  /**
   * Initialization of Component. Sets current role to guest and current action th login.
   * Subscribes the router action to get current modal
   */
  ngOnInit(): void {
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
    if (this.constants.currentUser != null) {
      this.dataUpdateForm = this.formBuilder.group({
        firstName: [this.constants.currentUser.firstName, Validators.required],
        lastName: [this.constants.currentUser.lastName, Validators.required],
        nickName: [this.constants.currentUser.nickName],
        birthDate: [this.constants.currentUser.birthDate, Validators.required],
        streetAddress: [this.constants.currentUser.streetAddress, Validators.required],
        zipCode: [this.constants.currentUser.zipCode, Validators.required],
        city: ['Smart City'],
        phone: [this.constants.currentUser.phone],
        email: [this.constants.currentUser.email, [Validators.required, Validators.email]]
      });

      this.createFoundObjectForm = this.formBuilder.group({
        // todo to be defined
      });

      this.createAnnouncementForm = this.formBuilder.group({
        // todo to be defined
      });
    } else {
      this.dataUpdateForm = this.formBuilder.group({});
      this.createFoundObjectForm = this.formBuilder.group({});
      this.createAnnouncementForm = this.formBuilder.group({});
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

      const user = JSON.stringify({
        uid: this.constants.firebaseUser.uid,
        firstName: this.dataUpdateForm.value.firstName,
        lastName: this.dataUpdateForm.value.lastName,
        nickName: this.dataUpdateForm.value.nickName,
        email: this.dataUpdateForm.value.email,
        birthDate: birthDateStr.toDateString(),
        streetAddress: this.dataUpdateForm.value.streetAddress,
        zipCode: this.dataUpdateForm.value.zipCode,
        phone: this.dataUpdateForm.value.phone
      });

      this.http.post('http://' + this.constants.host + ':9000/updateUser', {user}).subscribe(
        (val: any) => {
          if (val.status === 'success'){
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
            alert('Es ist ein Fehler aufgetregen. Bitte versuchen sie es später erneut.');
          }
        },
        error => {
          alert('Es ist ein Fehler aufgetregen. Bitte versuchen sie es später erneut.');
        });
    }
  }

  /**
   * Deactivated the user account and signs out the currently logged in user
   */
  deactivateUserAndLogout() {
    this.http.post('http://' + this.constants.host + ':9000/deactivateUser', {uid: this.constants.firebaseUser.uid}).subscribe(
      (val: any) => {
        if (val.status === 'success'){
          this.modalService.dismissAll();
          this.constants.performLogout();
          this.refreshData();
          this.constants.authAction = 'login';
          this.router.navigate(['/home']);
        } else {
          alert('Es ist ein Fehler aufgetregen. Bitte versuchen sie es später erneut.');
        }
      },
      error => {
        alert('Es ist ein Fehler aufgetregen. Bitte versuchen sie es später erneut.');
      });
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
  uploadImage() {
    // todo upload image for current user
  }

  // </editor-fold>
}
