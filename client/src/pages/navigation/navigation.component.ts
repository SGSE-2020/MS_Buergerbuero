import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators} from '@angular/forms';
import { GlobalConstantsService } from '../../app/global-constants.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})

export class NavigationComponent implements OnInit {
  public isMenuCollapsed = true;
  action: string;
  authForm: any;

  constructor(private http: HttpClient, public modalService: NgbModal, public constants: GlobalConstantsService,
              private firebaseAuth: AngularFireAuth, private formBuilder: FormBuilder) {
  }

  /**
   * Initialization of Component. Sets current role to guest and current action th login.
   * Builds the login form validation.
   */
  ngOnInit(): void {
    this.constants.userRole = 0;
    this.action = 'login';
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.checkIfUserIsLoggedIn();
  }

  // <editor-fold desc="Authentication functions">
  /**
   * Check if an user is signed in at the moment
   */
  checkIfUserIsLoggedIn(){
      this.firebaseAuth.currentUser.then((user) => {
          if (user != null){
            this.constants.userRole = 1;
            // todo check role from current logged in user
          } else {
            this.constants.currentUser = null;
          }
      });
  }

  /**
   * Perform login or register depending on current action when the form is valid
   */
  performLoginOrRegister() {
    if (this.authForm.valid) {
      if (this.action === 'login'){
        this.firebaseAuth.signInWithEmailAndPassword(this.authForm.value.email, this.authForm.value.password).then((result) => {
          result.user.getIdToken(true).then((token) => {
            this.http.post('http://localhost:9000/verifyUser', {token}).subscribe(
              (val: any) => {
                if (val.status === 'success'){
                  this.constants.currentUser = val.param.user;
                  this.constants.userRole = val.param.user.role;
                  this.constants.firebaseUser = result.user;
                  this.modalService.dismissAll();
                  this.action = 'login';
                } else {
                  alert('Es ist ein Fehler aufgetregen. Bitte versuchen sie es später erneut.');
                }
              },
              error => {
                alert('Es ist ein Fehler aufgetregen. Bitte versuchen sie es später erneut.');
              });
          });
        }, (error) => {
          if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found'
            || error.code === 'auth/user-disabled'){
            alert('Anmeldung fehlgeschlagen. Nutzerdaten fehlerhaft oder Nutzer existiert nicht.');
          } else{
            alert('Es ist ein Fehler aufgetregen. Bitte versuchen sie es später erneut.');
          }
        });
      } else {
        const birthDateStr = new  Date (this.authForm.value.birthDate.year + '-' +
           this.authForm.value.birthDate.month + '-' + this.authForm.value.birthDate.day);
        const format = birthDateStr.toUTCString();
        const locale = birthDateStr.toDateString();
        const user = JSON.stringify({
          gender: Number(this.authForm.value.gender),
          firstName: this.authForm.value.firstName,
          lastName: this.authForm.value.lastName,
          nickName: this.authForm.value.nickName,
          email: this.authForm.value.email,
          password: this.authForm.value.password,
          birthDate: birthDateStr.toDateString(),
          streetAddress: this.authForm.value.streetAddress,
          zipCode: this.authForm.value.zipCode,
          phone: this.authForm.value.phone
        });

        this.http.post('http://localhost:9000/registerUser', {user}).subscribe(
          (val: any) => {
            if (val.status === 'success'){
              alert('Bürgerkonto wurde erfolgreich erstellt.');
              this.modalService.dismissAll();
              this.action = 'register';
            } else {
              alert('Es ist ein Fehler aufgetregen. Bitte versuchen sie es später erneut.');
            }
          },
          error => {
            alert('Es ist ein Fehler aufgetregen. Bitte versuchen sie es später erneut.');
          });
      }
    }
  }

  /**
   * Logout the current signed in user and set the role to guest
   */
  performLogout() {
    this.firebaseAuth.signOut().then((result) => {
      this.constants.firebaseUser = null;
      this.constants.currentUser = null;
      this.constants.userRole = 0;
    });
  }

  // </editor-fold>

  // <editor-fold desc="Modal utility">
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

  modalClosed(){
    this.action = 'login';
  }

  /**
   * Set action for modal and reset form validation
   * @param givenAction String for action. Can be 'login' or 'register'
   */
  setAction(givenAction: string) {
    if (givenAction === 'login'){
      this.authForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    } else {
      this.authForm = this.formBuilder.group({
        gender: ['2'],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        nickName: [''],
        birthDate: ['', Validators.required],
        streetAddress: ['', Validators.required],
        zipCode: ['', Validators.required],
        city: ['Smart City'],
        phone: [''],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    }
    this.action = givenAction;
  }

  // </editor-fold>
}
