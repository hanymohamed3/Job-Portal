import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // Use styleUrls instead of styleUrl
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  role: string = 'jobSeeker'; // Default role is set to 'job seeker'

  companyDescription: string = '';
  contactInfo: string = '';
  jobPreference: string = '';
  logoUrl: string = '';
  resumeUrl: string = '';
  name: string = '';
  constructor(private auth: AuthService, private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  register() {
    if (this.email == '') {
      alert('Please Enter Your Email');
      return;
    }
    if (this.password == '') {
      alert('Please Enter Your Password');
      return;
    }
    if (this.role == '') {
      alert('Please Select a Role');
      return;
    }

    // job Seeker
    if (this.role == 'jobSeeker') {

      if (this.name == '') {
        alert('Please Enter your name');
        return;
      }

      if(this.resumeUrl == ''){
        alert('Please Enter your Resume');
        return;
      }
      const jobSeekerInfo = {
        name: this.name,
        contactInfo: this.contactInfo,
        resume: this.resumeUrl,
        jobPreference: this.jobPreference,
        savedJobs: []
      };

      this.auth.register(this.email, this.password, 'jobSeeker', jobSeekerInfo);

    } else if (this.role == 'company'){  // Company

      const companyInfo = {
        contactInfo: this.contactInfo,
        companyDescription: this.companyDescription,
        logo: this.logoUrl
      };
      
      this.auth.register(this.email, this.password, 'company', companyInfo);
      
    }

    this.email = '';
    this.password = '';
    this.role = ''; // Reset the role after registration
    this.name = '';
  }

  onFileChange(event: any) {
      const file = event.target.files[0];
    
      if (file) {
          const filePath = `company-logos/${new Date().getTime()}_${file.name}`;
          const fileRef = this.storage.ref(filePath);
          const uploadTask = this.storage.upload(filePath, file);
    
          uploadTask.percentageChanges().subscribe((percentage) => {
              console.log(`Uploading: ${percentage}%`);
          });
    
          uploadTask.snapshotChanges().pipe(
              finalize(() => {
                  fileRef.getDownloadURL().subscribe((downloadURL) => {
                      console.log('File available at', downloadURL);
                      this.logoUrl = downloadURL;
                  });
              })
          ).subscribe();
      }
  }
  
  onResumeChange(event: any){
    const file = event.target.files[0];
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
                this.resumeUrl = downloadURL; // Update the userData object with the resume URL
            });
        })
    ).subscribe();
  }
  
}