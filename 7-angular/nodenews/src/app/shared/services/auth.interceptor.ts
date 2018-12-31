import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  
  constructor(public auth: AuthService) {}
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let tokec = this.auth.getToken();
    // Ce tokec ni enak null potem dodaj na request tokec
    console.log('tokec')
    if (tokec) { 
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${tokec.accessToken}`
        }
      });
     }
    return next.handle(request);
  }
}