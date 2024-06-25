import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../../services/job.service';
import { Job } from '../../interfaces/job';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit {
  jobId: string = '';
  job: Job | null = null;

  userRole$!: Observable<string | null>;
  userData: any; // This will hold the user data
  jobSaved: boolean = false;   // flag to check if job saved or not

  constructor(private route: ActivatedRoute, private jobService: JobService, private authService: AuthService, private firestore: AngularFirestore) { }

  ngOnInit(): void {

    this.userRole$ = this.authService.getCurrentUserRole();

    this.route.params.subscribe(params => {
      this.jobId = params['id'];
      this.getJobDetails();
    });
    // Fetch jobSeeker-specific data
    this.authService.getCurrentUser().subscribe(user => {
      this.userData = user;
      console.log('Job Seeker Data:', this.userData);
    });
  }
  getJobDetails() {
    this.jobService.getJobById(this.jobId).subscribe(
      (data: Job | undefined) => {
        if (data) {
          this.job = data;
        } else {
          console.error('Job not found');
        }
      },
      (err: any) => {
        console.error('Error fetching job details:', err);
      }
    );
  }
  
  applyForJob() {
    if (this.job) {

      if (!this.job.applied_users) {
        // If applied_users array doesn't exist, initialize it as an empty array
        this.job.applied_users = [];
      }
      // Check if the user is not already in the applied_users array
      if (!this.job.applied_users.includes(this.userData.uid)) {
        this.job.applied_users.push(this.userData.uid);
        this.job.applied_count += 1;
      }
      this.jobService.updateJob(this.job).then(() => {
        alert('Applied successfully, pending for company approval.');
      }).catch(error => {
        alert('Error applying job: ' + error);
      });
    } else {
      console.error('Job details are not available.');
    }
  }

  checkJobApplStatus(): boolean {
    if (this.job && this.job.applied_users) {
      return this.job.applied_users.includes(this.userData.uid);
    } else {
      return false; // Return false if job or applied_users is null
    }
  }

  saveJob() {
    const jobId = this.job?.job_id;
    if (jobId && !this.userData.savedJobs.includes(jobId)) {
      this.userData.savedJobs.push(jobId); // Add the job ID to the saved jobs array
      this.updateUserData(); // Update the user data in Firebase
    }
    this.jobSaved = true; // Update jobSaved variable
  }
  checkJobSaving(){
    return(this.job?.job_id && !this.userData.savedJobs.includes(this.job.job_id));
  }
  updateUserData() {
    this.firestore.collection('users').doc(this.userData.uid).update({
      savedJobs: this.userData.savedJobs // Update the saved jobs array in Firestore
    }).then(() => {
      console.log('User data updated successfully');
    }).catch(error => {
      console.error('Error updating user data:', error);
    });
  }
}
