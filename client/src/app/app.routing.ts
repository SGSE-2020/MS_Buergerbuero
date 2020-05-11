import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { BlackBoardComponent } from '../pages/black-board/black-board.component';
import { UserAccountComponent } from '../pages/user-account/user-account.component';
import { WorkComponent } from '../pages/work/work.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'black-board', component: BlackBoardComponent },
  { path: 'user-account', component: UserAccountComponent },
  { path: 'work', component: WorkComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }
