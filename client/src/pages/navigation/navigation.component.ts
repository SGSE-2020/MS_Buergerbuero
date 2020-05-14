import {Component, OnInit, TemplateRef} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import {FormBuilder, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})

export class NavigationComponent implements OnInit {
  public isMenuCollapsed = true;
  action: string;
  currentUser: any;
  currentRole: number; // 0 = Gast, 1 = Bürger, 2 = Mitarbeiter

  authForm: any;

  constructor(private http: HttpClient, public modalService: NgbModal,
              private firebaseAuth: AngularFireAuth, private formBuilder: FormBuilder) {
  }

  /**
   * Initialization of Component. Sets current role to guest and current action th login.
   * Builds the login form validation.
   */
  ngOnInit(): void {
    this.currentRole = 0;
    this.action = 'login';
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Function to open the modal
   * @param modalContent Modal that should be opened
   */
  openModal(modalContent: any) {
    this.modalService.open(modalContent, {centered: true});
  }

  /**
   * Perform login or register depending on current action when the form is valid
   */
  performLoginOrRegister() {
    if (this.authForm.valid) {
      if (this.action === 'login'){
        this.firebaseAuth.signInWithEmailAndPassword(this.authForm.value.email, this.authForm.value.password).then((result) => {
          result.user.getIdToken(true).then((token) => {
            this.http.post('http://localhost:9000/verifyUser', {
              token
            }).subscribe(
              (val) => {
                // todo dismiss modal -> login successful
                // todo get role from response
                console.log(val);

                this.currentRole = 0;
                this.currentUser = result.user;
                this.modalService.dismissAll();
                // todo hide login button and show nickname of user
              },
              error => {
                console.log(error);
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
        // todo perform register
        alert(this.authForm.value.gender);
      }
    }
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
        nickname: [''],
        birthDate: [null, Validators.required],
        streetAddress: ['', Validators.required],
        zipcode: ['', Validators.required],
        city: ['Smart City'],
        phone: [''],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    }
    this.action = givenAction;
  }
}
