import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.getCurrentUserRole().pipe(
      map(role => {
        if(!role){
          this.router.navigate(['/home-page']); // if not registerd go to home
          return false;
        }else{
        if (role === 'company' || role === 'jobSeeker') {
          if (role === 'jobSeeker') {
            const allowedRoutes = ['job-listing', 'profile', 'saved-jobs', 'job-details'];
            const currentRoute = route.routeConfig?.path || ''; // Get the route path
            if (!allowedRoutes.some(allowedRoute => currentRoute.startsWith(allowedRoute))) {
              this.router.navigate(['/job-listing']);
              return false;
            }
          }
          return true;
        } else {
          return true; // Allow access to other pages
        }
      }
      })
    );
  }
}
