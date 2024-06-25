import { Component } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.css'
})
export class CompanyProfileComponent {

  userRole$!: Observable<string | null>;
  userData: any; // This will hold the user data

  editMode: boolean = false; // Flag to track edit mode
  userEmail: string = ''; // Variable to store user's email

  constructor(private router: Router, private authService: AuthService, private storage : AngularFireStorage) { }

  ngOnInit(): void {
    this.userRole$ = this.authService.getCurrentUserRole();

    // Fetch user email
    this.authService.getCurrentUserEmail().subscribe(email => {
      this.userEmail = email!;
    });

    // Subscribe to userRole$ and handle logic based on user role
    this.userRole$.subscribe(role => {
      if (role === 'company') {
        // Fetch company-specific data
        this.authService.getCurrentUser().subscribe(user => {
          this.userData = user;
          console.log('Company Data:', this.userData);
        });
      }
    });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  updateProfile() {
    if (this.userData && this.userEmail) {
      // Update user data in the database
      this.authService.updateUser(this.userData.uid, this.userData).then(() => {
        console.log('Profile updated successfully');
        this.editMode = false; // Exit edit mode after successful update
        alert('Profile Updated Successfully.');
      }).catch((error: any) => {
        console.error('Error updating profile:', error);
      });
    }
  }

  onLogoChange(event: any) {
    const file = event.target.files[0];
    const filePath = `company-logos/${new Date().getTime()}_${file.name}`; // Generate a unique file path
    const fileRef = this.storage.ref(filePath); // Reference to the file path in Firebase Storage
    const uploadTask = this.storage.upload(filePath, file); // Upload the file

    // Track the percentage changes of the upload task
    uploadTask.percentageChanges().subscribe((percentage: any) => {
      console.log(`Uploading: ${percentage}%`);
    });

    // Get the download URL once the upload is complete
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((downloadURL) => {
          console.log('File available at', downloadURL);
          this.userData.logo = downloadURL; // Update the userData object with the logo URL
        });
      })
    ).subscribe();
  }

}
