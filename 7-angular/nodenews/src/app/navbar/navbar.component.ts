import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as $ from 'jquery';
import 'bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Token } from '../shared/models/token';
import { Subscription } from 'rxjs';
import { MessengerService } from '../shared/services/messenger.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit { 
  loginForm: FormGroup;
  remainingTime: number;
  tokec: Token;
  loggedIn: boolean;
  loading: boolean;
  errorMsg: string;
  subscription: Subscription

  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private messenger: MessengerService,
  ) { }

  ngOnInit() {
    this.loginForm = this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    $('#loginModal').on('shown.bs.modal', function () {
      $('#myInput').trigger('focus')
    });

    this.tokec = this.authService.getToken();
    this.loggedIn = false;
    if (this.tokec) {
      if (this.tokec.user) {
        // Uporabnik se ima token v local storage in je prijavljen
        this.loggedIn = true;
        this.authService.signOutCountdown(Math.floor(
          (new Date(this.tokec.accessTokenExpiresAt).getTime() - new Date().getTime()) / 1000)
        );
        this.getTimeLeft();
      }
    }
  }

  getTimeLeft() {
    this.subscription = this.authService.timeToEnd$.subscribe({
      next: t => {
        this.remainingTime = t;
        if (this.remainingTime == 0) {
          this.loggedIn = false;
          this.logout();
        }
      }
    });
  }

  login() {
    this.loading = true;
    this.authService.signIn(this.loginForm.value.username, this.loginForm.value.password).subscribe(
      response => {
        this.loading = false;
        this.tokec = response;
        this.loggedIn = true;
        this.getTimeLeft();
        $('#loginModal').modal('hide');

        // Sporoci novicam, naj se posodobijo (vkljucijo placljive)
        this.messenger.toggleLogin(this.loggedIn);
      },
      error => {
        this.errorMsg = error.error.error;
        this.loading = false;
      }
    )
  }

  logout() {
    this.subscription.unsubscribe();
    this.loggedIn = false;
    this.authService.signOut();

    // Sporoci novicam, naj se posodobijo (odstranijo placljive)
    this.messenger.toggleLogin(this.loggedIn);
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

}
