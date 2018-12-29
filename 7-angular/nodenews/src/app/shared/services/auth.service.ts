import { Injectable } from '@angular/core';
import { Subject, interval, Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Token } from '../models/token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl: string = 'http://localhost:3000/oauth/token';
  public timeToEnd$: Subject<number> = new Subject();

  constructor(private http: HttpClient) {}

  signIn(username: string, password: string): Observable<Token> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa('NodeNews:geslo123'),
      }),
    };
    let body = new HttpParams();
    body = body.set('grant_type', 'password');
    body = body.set('scope', 'read write');
    body = body.set('username', username);
    body = body.set('password', password);

    return this.http.post<Token>(this.authUrl, body, httpOptions).pipe(
      map(
        response => {
          localStorage.setItem('tokec', JSON.stringify(response));
          let expiresIn = Math.floor(
            (new Date(response.accessTokenExpiresAt).getTime() -
              new Date().getTime()) /
              1000
          );
          this.signOutCountdown(expiresIn);
          return response;
        },
        error => console.error(error)
      )
    );
  }

  signOutCountdown(secondsLeft: number) {
    // Ustvari nov timer, ki traja toliko kolikor ima token cas poteka
    interval(1000)
    .pipe(
      take(secondsLeft),
      map(t => secondsLeft - 1 - t)
    )
    .subscribe(t => {
      this.timeToEnd$.next(t);
      if (t == 0) {
        this.signOut();
      }
    });
  }

  signOut() {
    localStorage.removeItem('tokec');
  }
}
