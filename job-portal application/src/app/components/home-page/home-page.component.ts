import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {


  constructor(private router: Router) { }

  login() {
    // Navigate to the login page with the specified role ID
    this.router.navigate(['/login']);
  }
}
