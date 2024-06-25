import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'job-portal';

  isLoggedIn: boolean = false;
  userEmail: string | null = null;
  userRole$!: Observable<string | null>;
  role: string | null = null;
  constructor(private authService: AuthService, private router: Router) {
    this.authService.isLoggedIn().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        // If user is logged in, fetch user email
        this.authService.getCurrentUserEmail().subscribe((email: any) => {
          this.userEmail = email;
        });
      } else {
        this.userEmail = null;
      }
    });

    this.userRole$ = this.authService.getCurrentUserRole();
    this.userRole$.subscribe(role => {
      this.role = role;
    });
  }

  logout() {
    this.authService.logout();
  }

  // navigateToProfile() {
  //   this.router.navigate(['/profile']);
  // }
}
