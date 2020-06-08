import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { RoutingModule } from './app.routing';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { NavigationComponent } from '../pages/navigation/navigation.component';
import { HomeComponent } from '../pages/home/home.component';
import { BlackBoardComponent } from '../pages/black-board/black-board.component';
import { UserAccountComponent } from '../pages/user-account/user-account.component';
import { WorkComponent } from '../pages/work/work.component';

import { GlobalConstantService } from '../services/global-constant.service';
import { NotificationService } from '../services/notification.service';


@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    BlackBoardComponent,
    UserAccountComponent,
    WorkComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    HttpClientModule,
    RoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    ToastrModule.forRoot( {
      maxOpened: 2,
      preventDuplicates: true,
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
      autoDismiss: true,
      newestOnTop: true })
  ],
  providers: [
    GlobalConstantService,
    NotificationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
