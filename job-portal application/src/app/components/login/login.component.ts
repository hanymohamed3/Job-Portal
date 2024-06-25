import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  route: any;

  constructor(private auth: AuthService, private router: Router) { }
  

  login() {
    if (this.email == '') {
      alert('Please Enter  Your Email');
      return;
    }

    if (this.password == '') {
      alert('Please Enter  Your password');
      return;
    }

    this.auth.login(this.email, this.password);
    this.password = '';
  }
}
