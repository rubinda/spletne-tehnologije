import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let tokec = JSON.parse(localStorage.getItem('tokec'))
    if (tokec) {
      if (tokec.user) {
        if (tokec.user.role === 'admin') {
          // Uporabnik je privaljen in ima administratorske pravice
          return true;
        }
      }
    }
    // Tokec ne obstaja, ali pa ni admin
    return false;
  }
}
