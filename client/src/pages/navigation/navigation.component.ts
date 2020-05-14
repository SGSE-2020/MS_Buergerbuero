import {Component, OnInit, TemplateRef} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})

export class NavigationComponent implements OnInit {
  public isMenuCollapsed = true;
  authForm: any;
  email: any;
  password: any;
  action: any;
  currentUser: any;

  constructor(private http: HttpClient, public modalService: NgbModal,
              private firebaseAuth: AngularFireAuth, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.authForm = this.formBuilder.group({
      email: [Validators.required],
      password: [Validators.required]
    });
  }

  openModal(modalContent: any) {
    this.modalService.open(modalContent, {centered: true});
  }

  performLoginOrRegister() {
    // todo perform register
    // todo auth form a validation for only login or register fields
    if (this.authForm.valid) {
      this.firebaseAuth.signInWithEmailAndPassword(this.email, this.password).then((result) => {
        result.user.getIdToken(true).then((token) => {
          this.http.post('http://localhost:9000/verifyUser', {
            token
          }).subscribe(
            (val) => {
              console.log('POST call successful value returned in body', val);
              // todo dismiss modal -> login successful
              this.currentUser = result.user;
              this.modalService.dismissAll();
              // todo hide login button and show nickname of user
            },
            response => {
              console.log('POST call in error', response);
              // todo alert für fehler aufgetreten bitte versuchen sie es erneut
            });
        });
      }, (error) => {
        // todo add alert box with error
        if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found'){
          alert('E-Mail oder Passwort falsch oder User existiert nicht');
        } else if (error.code === 'auth/user-disabled'){
          alert('Dieser Nutzer ist deaktiviert');
        }
      });
    }
  }
}
