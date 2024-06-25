import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuardService {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getCurrentUserRole().pipe(
      map(role => {
        if (!role) {
          return true;  // User is not logged in, allow access
        } else {
          this.router.navigate(['/job-listing']);  // User is logged in, redirect to a main page
          return false;
        }
      })
    );
  }
}
