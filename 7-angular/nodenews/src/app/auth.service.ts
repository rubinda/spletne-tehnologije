import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string;
  username: string;
  fullName: string;
  role: string;
  timeToEnd$: Subject<number>;
  
  constructor() { }

  signIn() {

  }

  signOut() {

  }
}
