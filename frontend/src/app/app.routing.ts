import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { BlackBoardComponent } from '../pages/black-board/black-board.component';
import { UserAccountComponent } from '../pages/user-account/user-account.component';
import { WorkComponent } from '../pages/work/work.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, runGuardsAndResolvers: 'always' },
  { path: 'black-board', component: BlackBoardComponent, runGuardsAndResolvers: 'always'  },
  { path: 'user-account', component: UserAccountComponent, runGuardsAndResolvers: 'always'  },
  { path: 'work', component: WorkComponent, runGuardsAndResolvers: 'always'  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})

export class RoutingModule { }
