import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule }    from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ApolloModule } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NewsComponent } from './news/news.component';
import { AddNewsComponent } from './add-news/add-news.component';
import { ArticleComponent } from './article/article.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { GraphQLModule } from './apollo.config';
import { TokenInterceptor } from './shared/services/auth.interceptor';
import { ByauthorComponent } from './news/byauthor.component';
 
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    NewsComponent,
    AddNewsComponent,
    ArticleComponent,
    NavbarComponent,
    DropdownDirective,
    UnauthorizedComponent,
    ByauthorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ApolloModule,
    HttpLinkModule,
    GraphQLModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
