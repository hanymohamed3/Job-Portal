import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable, finalize } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  userRole$!: Observable<string | null>;
  userData: any; // This will hold the user data

  editMode: boolean = false; // Flag to track edit mode
  userEmail: string = ''; // Variable to store user's email
  // currUserData: any;
  isCompany: boolean = false;

  constructor(private router: Router, private authService: AuthService, private storage: AngularFireStorage, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.userRole$ = this.authService.getCurrentUserRole();

    // Fetch user email
    this.authService.getCurrentUserEmail().subscribe(email => {
      this.userEmail = email!;
    });

    this.userRole$.subscribe(role => {
      if (role === 'company') {
        // Fetch company-specific data
        this.route.queryParams.subscribe(params => {
          const user = JSON.parse(params['user']);
          this.userData = user;
        });
        this.isCompany = true;

      } else {
        // Fetch jobSeeker-specific data
        this.authService.getCurrentUser().subscribe(user => {
          this.userData = user;
          console.log('Job Seeker Data:', this.userData);
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
      }).catch(error => {
        console.error('Error updating profile:', error);
      });
    }
  }

  onResumeChange(event: any) {
    const file = event.target.files[0]; // Get the selected file
    const filePath = `resumes/${new Date().getTime()}_${file.name}`; // Generate a unique file path
    const fileRef = this.storage.ref(filePath); // Reference to the file path in Firebase Storage
    const uploadTask = this.storage.upload(filePath, file); // Upload the file

    // Track the percentage changes of the upload task
    uploadTask.percentageChanges().subscribe((percentage) => {
      console.log(`Uploading Resume: ${percentage}%`);
    });

    // Get the download URL once the upload is complete
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((downloadURL) => {
          console.log('Resume available at', downloadURL);
          this.userData.resume = downloadURL;
        });
      })
    ).subscribe();
  }

}
