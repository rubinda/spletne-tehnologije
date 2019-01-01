import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let tokec = JSON.parse(localStorage.getItem('tokec'))
    let canWriteArticle = false
    if (tokec) {
      if (tokec.user) {
        if (tokec.user.role === 'admin') {
          // Uporabnik je privaljen in ima administratorske pravice
          canWriteArticle = true;
        }
      }
    }
    // Tokec ne obstaja, ali pa ni admin
    if (!canWriteArticle)
      this.router.navigate(['/401'])

    return canWriteArticle;
  }
}
