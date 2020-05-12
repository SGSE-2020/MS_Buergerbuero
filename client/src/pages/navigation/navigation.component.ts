import {Component, OnInit, TemplateRef} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  public isMenuCollapsed = true;
  constructor(private http: HttpClient, private modalService: NgbModal, private firebaseAuth: AngularFireAuth) { }

  ngOnInit(): void {

  }

  openModalVerticallyCentered(modalContent: any) {
    this.modalService.open(modalContent, { centered: true });
  }

  performLogin() {
    this.firebaseAuth.signInWithEmailAndPassword('exampleuser@test.de', 'sgse-ss2020').then((result) => {
      console.log(result);
      result.user.getIdToken(true).then((token) => {
        // todovery user token
        this.http.post('http://localhost:9000/verifyUser', {
          token
        }).subscribe(
          (val) => {
            console.log('POST call successful value returned in body',
              val);
          },
          response => {
            console.log('POST call in error', response);
          },
          () => {
            console.log('The POST observable is now completed.');
          });
      });
    }, (error) => {
      console.log(error);
      if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found'){
        alert('E-Mail oder Passwort falsch oder User existiert nicht');
      } else if (error.code === 'auth/user-disabled'){
        alert('Dieser Nutzer ist deaktiviert');
      } else {
        alert(error);
      }
    });
  }
}
