import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JobService } from '../../services/job.service'; // Import the job service to fetch jobs
import { Job } from '../../interfaces/job';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-saved-jobs',
  templateUrl: './saved-jobs.component.html',
  styleUrls: ['./saved-jobs.component.css'] // Use styleUrls instead of styleUrl
})
export class SavedJobsComponent {

  userData: any; // This will hold the user data
  savedJobs: any[] = []; // This will hold the saved jobs

  constructor(private route: ActivatedRoute, private authService: AuthService, private firestore: AngularFirestore, private jobService: JobService, private router: Router) { }

  ngOnInit(): void {
    // Fetch jobSeeker-specific data
    this.authService.getCurrentUser().subscribe(user => {
      this.userData = user;
      this.getSavedJobs();
    });
  }
  getSavedJobs() {
    // If user data and saved jobs are available
    if (this.userData && this.userData.savedJobs.length > 0) {
      this.userData.savedJobs.forEach((jobId: string) => {
        this.jobService.getJobById(jobId).subscribe(
          job => {
            if (job.job_id && !job.puased) { // check if the job not deleted
              this.savedJobs.push(job);
            } else {
              // If job is deleted, remove its ID from userData.savedJobs
              this.userData.savedJobs = this.userData.savedJobs.filter((id: string) => id !== jobId);
              // Update the userData in Firestore
              this.updateUserData(this.userData);
            }
          },
          error => {
            console.error("Error fetching job:", error);
          }
        );
      });
    }
  }


// Method to unsave a job with confirmation
unsaveJob(job: any) {
  const confirmation = window.confirm('Are you sure you want to unsave this job?');
  if (confirmation) {
    this.jobService.unsaveJob(this.userData, job)
      .then(() => {
        // Job successfully unsaved, remove it from savedJobs array
        this.savedJobs = this.savedJobs.filter(savedJob => savedJob.job_id !== job.job_id);
      })
      .catch(error => {
        console.error('Error un-saving job:', error);
      });
  }
}

  updateUserData(userData: any) {
    // Assuming this.userData contains the user's data and you have access to AngularFirestore
    this.firestore.collection('users').doc(this.userData.uid).update({
      savedJobs: this.userData.savedJobs // Update the saved jobs array in Firestore
    }).then(() => {
      console.log('User data updated successfully');
    }).catch(error => {
      console.error('Error updating user data:', error);
    });
  }

  viewJob(job: Job) {
    this.router.navigate(['/job-details', job.job_id]);
  }

  checkJobApplStatus(job: Job) {
    if (job && job.applied_users) {
      return job.applied_users.includes(this.userData.uid);
    } else {
      return false; // Return false if job or applied_users is null
    }
  }

  ApplyForJob(job: Job) {
    if (job) {
      if (!job.applied_users) {
        // If applied_users array doesn't exist, initialize it as an empty array
        job.applied_users = [];
      }
      // Check if the user's email is not already in the applied_users array
      if (!job.applied_users.includes(this.userData.uid)) {
        job.applied_users.push(this.userData.uid);
        job.applied_count += 1;
      }

      this.jobService.updateJob(job).then(() => {
        alert('Applied successfully, pending for company approval.');
      }).catch(error => {
        alert('Error applying job: ' + error);
      });
    }
  }
}
