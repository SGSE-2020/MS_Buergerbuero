import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalConstantService } from '../../services/global-constant.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})

export class NavigationComponent implements OnInit {
  public isMenuCollapsed = true;
  authForm: any;
  isSubmitted = false;

  constructor(private http: HttpClient, private modalService: NgbModal, public constants: GlobalConstantService,
              private firebaseAuth: AngularFireAuth, private formBuilder: FormBuilder, private router: Router,
              private notificationService: NotificationService) {
  }

  /**
   * Initialization of Component. Sets current role to guest and current action th login.
   * Builds the login form validation.
   */
  ngOnInit(): void {
    this.constants.userRole = 0;
    this.constants.authAction = 'login';
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
    this.isSubmitted = true;
    if (this.authForm.valid) {
      if (this.constants.authAction === 'login'){
        this.firebaseAuth.signInWithEmailAndPassword(this.authForm.value.email, this.authForm.value.password).then((result) => {
          result.user.getIdToken(true).then((token) => {
            this.http.post('http://' + this.constants.host + ':9000/user/verify/' + token, {}).subscribe(
              (val: any) => {
                if (val.status === 'success'){
                  this.constants.userRole = val.param.role;
                  this.constants.firebaseUser = result.user;
                  this.modalService.dismissAll();
                  this.isSubmitted = false;
                  this.constants.getCurrentUserData();
                  this.router.navigate([this.router.url]);
                } else {
                  this.notificationService.showError('Es ist ein Fehler aufgetreten. Bitte versuchen sie es später erneut',
                    'toast-top-center');
                }
              },
              error => {
                this.notificationService.showError('Es ist ein Fehler aufgetreten. Bitte versuchen sie es später erneut',
                  'toast-top-center');
              });
          });
        }, (error) => {
          if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found'
            || error.code === 'auth/user-disabled'){
            this.notificationService.showError('Anmeldung fehlgeschlagen. Nutzerdaten fehlerhaft oder Nutzer existiert nicht.',
              'toast-top-center');
          } else{
            this.notificationService.showError('Es ist ein Fehler aufgetreten. Bitte versuchen sie es später erneut',
              'toast-top-center');
          }
        });
      } else {
        const birthDateStr = new Date (this.authForm.value.birthDate.year + '-' +
           this.authForm.value.birthDate.month + '-' + this.authForm.value.birthDate.day);
        const user = {
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
        };

        this.http.post('http://' + this.constants.host + ':9000/user/register', user).subscribe(
          (val: any) => {
            if (val.status === 'success'){
              this.notificationService.showSuccess('Nutzerkonto wurde erfolgreich erstellt',
                'toast-top-left');
              this.modalService.dismissAll();
              this.isSubmitted = false;
              this.setAction('login');
            } else {
              this.notificationService.showError('Es ist ein Fehler aufgetreten. Bitte versuchen sie es später erneut',
                'toast-top-center');
            }
          },
          error => {
            this.notificationService.showError('Es ist ein Fehler aufgetreten. Bitte versuchen sie es später erneut',
              'toast-top-center');
          });
      }
    }
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

  /**
   * Set authAction to login if modal was closed
   */
  modalClosed(){
    this.constants.authAction = 'login';
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
    this.constants.authAction = givenAction;
  }
  // </editor-fold>

}
