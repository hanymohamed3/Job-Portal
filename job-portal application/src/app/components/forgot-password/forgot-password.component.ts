import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'] // Correct property name
})
export class ForgotPasswordComponent {

  email: string = '';
  showVerificationMessage: boolean = false;

  constructor(private auth: AuthService) { }

  forgotPassword() {
    this.auth.forgotPassword(this.email).then(() => {
      this.showVerificationMessage = true;
    }).catch(error => {
      console.error("Error sending password reset email", error);
    });
  }
}
