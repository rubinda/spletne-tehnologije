import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NewsComponent } from './news/news.component';
import { AddNewsComponent } from './add-news/add-news.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { CanDeactivateGuard } from './shared/guards/leave-news.guard';

const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
  },
  { 
    path: 'news', 
    component: NewsComponent,
  },
  { 
    path: 'news/add',
    component: AddNewsComponent, 
    canActivate: [ AuthGuard ], 
    canDeactivate: [ CanDeactivateGuard ],
  },
  { 
    path: '404', 
    component:  NotFoundComponent 
  },
  { 
    path: '401', 
    component: UnauthorizedComponent 
  },
  { 
    path: '**', 
    redirectTo: '404' 
  }, 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
