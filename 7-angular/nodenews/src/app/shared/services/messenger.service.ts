import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {

  loggedIn = false;

  @Output() change: EventEmitter<boolean> = new EventEmitter()

  constructor() { }

  toggleLogin(isLoggedIn: boolean) {
    this.loggedIn = isLoggedIn;
    this.change.emit(this.loggedIn);
  }
}
