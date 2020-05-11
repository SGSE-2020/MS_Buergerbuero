import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { RoutingModule } from './app.routing';
import { NavigationComponent } from '../pages/navigation/navigation.component';
import { HomeComponent } from '../pages/home/home.component';
import { BlackBoardComponent } from '../pages/black-board/black-board.component';
import { UserAccountComponent } from '../pages/user-account/user-account.component';
import { WorkComponent } from '../pages/work/work.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    BlackBoardComponent,
    UserAccountComponent,
    WorkComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    MatIconModule,
    RoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
