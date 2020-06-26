import {AfterViewInit, Component, OnInit} from '@angular/core';
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

export class NavigationComponent implements OnInit, AfterViewInit {
  isMenuCollapsed = true;
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
      email: ['', [Validators.required, Validators.email, Validators.maxLength(this.constants.maxVarcharLength)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(this.constants.maxVarcharLength)]]
    });

    this.firebaseAuth.authState.subscribe(user => {
      if (user) {
        this.constants.firebaseUser = user;
        localStorage.setItem('user', JSON.stringify(this.constants.firebaseUser));
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  /**
   * Function after view load finished
   */
  ngAfterViewInit(): void {
    const user = JSON.parse(localStorage.getItem('user'));
    const isLoggedIn = (user !== null && user.emailVerified !== false) ? true : false
    if (isLoggedIn){
      this.constants.firebaseUser = user;
      if (this.constants.firebaseUser.uid !== this.constants.currentUser?.uid){
        this.constants.getCurrentUserData().then(() => {
          if (this.constants.currentUser == null){
            this.constants.performLogout();
          } else {
            this.constants.userRole = this.constants.currentUser.role;
          }
        });
      }
    }
  }

  /**
   * Return active route
   */
  isActive() {
    return this.router.url;
  }

  // <editor-fold desc="Authentication functions">
  /**
   * Perform login or register depending on current action when the form is valid
   */
  performLoginOrRegister() {
    this.isSubmitted = true;
    if (this.authForm.valid) {
      if (this.constants.authAction === 'login'){
        this.firebaseAuth.signInWithEmailAndPassword(this.authForm.value.email, this.authForm.value.password).then((result) => {
          result.user.getIdToken(true).then((token) => {
            this.http.post(this.constants.host + '/user/verify/' +
              token, {}).subscribe((val: any) => {
                if (val.status === 'success'){
                  this.constants.userRole = val.param.role;
                  this.constants.firebaseUser = result.user;
                  this.modalService.dismissAll();
                  this.isSubmitted = false;
                  this.constants.getCurrentUserData().then(res => {
                    this.router.navigate([this.router.url]);
                  }).finally(() => {
                  });
                } else {
                  this.notificationService.showError('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut',
                    'toast-top-center');
                }
              },
              error => {
                this.notificationService.showError('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut',
                  'toast-top-center');
              });
          });
        }, (error) => {
          if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found'
            || error.code === 'auth/user-disabled'){
            this.notificationService.showError('Anmeldung fehlgeschlagen. Nutzerdaten fehlerhaft oder Nutzer existiert nicht.',
              'toast-top-center');
          } else{
            this.notificationService.showError('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut',
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

        this.http.post(this.constants.host + '/user/register',
          user).subscribe((val: any) => {
            if (val.status === 'success'){
              this.notificationService.showSuccess('Nutzerkonto wurde erfolgreich erstellt',
                'toast-top-left');
              this.modalService.dismissAll();
              this.isSubmitted = false;
              this.setAction('login');
            } else {
              this.notificationService.showError('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut',
                'toast-top-center');
            }
          },
          error => {
            this.notificationService.showError('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut',
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
        firstName: ['', [Validators.required, Validators.maxLength(this.constants.maxVarcharLength)]],
        lastName: ['', [Validators.required, Validators.maxLength(this.constants.maxVarcharLength)]],
        nickName: ['', Validators.maxLength(this.constants.maxVarcharLength)],
        birthDate: ['', Validators.required],
        streetAddress: ['', [Validators.required, Validators.maxLength(this.constants.maxVarcharLength)]],
        zipCode: ['', [Validators.required, Validators.maxLength(5)]],
        city: ['Smart City'],
        phone: ['', Validators.maxLength(this.constants.maxVarcharLength)],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(this.constants.maxVarcharLength)]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(this.constants.maxVarcharLength)]]
      });
    }
    this.constants.authAction = givenAction;
  }
  // </editor-fold>

  /**
   * Back to smart city portal
   */
  backToPortal() {
    window.location.href = 'http://portal.dvess.network';
  }


}
