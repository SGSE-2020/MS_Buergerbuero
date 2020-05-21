import { Component, OnInit } from '@angular/core';
import { GlobalConstantsService } from '../../app/global-constants.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuth } from '@angular/fire/auth';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {
  dataUpdateForm: any;
  createFoundObjectForm: any;
  createAnnouncementForm: any;

  constructor(public constants: GlobalConstantsService, public modalService: NgbModal,
              private firebaseAuth: AngularFireAuth, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
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

    this.createFoundObjectForm = this.formBuilder.group({
      // todo to be defined
    });

    this.createAnnouncementForm = this.formBuilder.group({
      // todo to be defined
    });
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

  updateData() {
    if (this.dataUpdateForm.valid) {
      // todo perform update of user data
    }
  }

  deactivateUserAndLogout() {
    // todo deactivate user account and log out current user -> redirect to home view
  }

  createNewAnnouncement() {
    if (this.createAnnouncementForm.valid) {
      // todo create announcement
    }
  }

  createNewFoundItem() {
    if (this.createFoundObjectForm.valid) {
      // todo create found item
    }
  }

  uploadImage() {
    // todo upload image for current user
  }
}
