import { Component } from '@angular/core';
import { Job } from '../../interfaces/job';
import { JobService } from '../../services/job.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { catchError, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrl: './create-job.component.css'
})
export class CreateJobComponent {


  constructor(private jobData: JobService, private router: Router, private authService: AuthService) { }

  jobObj: Job = {
    job_id: '',
    job_title: '',
    company_name: '',
    location: '',
    country: '',
    job_type: '',
    job_description: '',
    education: '',
    experience: '',
    created_on: new Date(),
    applied_users: [],
    applied_count: 0,
    how_to_apply: '',
    company_id: '',
    puased: false
  };

  postJob(job: Job) {
    // Check if required fields are not empty
    if (
      job.job_title !== '' && job.company_name !== '' && job.location !== '' && job.country !== '' && job.job_type !== '' &&
      job.job_description !== '' && job.education !== '' && job.experience !== '' && job.how_to_apply !== ''
    ) {
      // Assign job details
      this.jobObj.job_title = job.job_title;
      this.jobObj.company_name = job.company_name;
      this.jobObj.location = job.location;
      this.jobObj.country = job.country;
      this.jobObj.job_type = job.job_type;
      this.jobObj.job_description = job.job_description;
      this.jobObj.education = job.education;
      this.jobObj.experience = job.experience;
      this.jobObj.how_to_apply = job.how_to_apply;

      // Get the current user's data and add the job
      this.authService.getCurrentUser().pipe(
        switchMap(currentUser => {
          if (currentUser && currentUser.uid) {
            // Assign the company ID
            this.jobObj.company_id = currentUser.uid;
            // Add the job
            return this.jobData.addJob(this.jobObj);
          } else {
            console.error('Current user data not available.');
            return of(null);
          }
        }),
        catchError(error => {
          console.error('Error getting current user:', error);
          return of(null);
        })
      ).subscribe(() => {
        // Reset the form and navigate to the job listing page
        this.resetForm();
        this.router.navigate(['/job-listing']);
      }, error => {
        console.error('Error adding job:', error);
        // Handle error if needed
      });
    } else {
      // If any required field is empty, show an error message or take appropriate action
      alert('Please fill in all required fields.');
      return;
    }
  }

  private resetForm() {
    // Reset job object to clear form fields
    this.jobObj = {
      job_id: '',
      job_title: '',
      company_name: '',
      location: '',
      country: '',
      job_type: '',
      job_description: '',
      education: '',
      experience: '',
      created_on: new Date(),
      applied_users: [],
      applied_count: 0,
      how_to_apply: '',
      company_id: '',
      puased: false
    };
  }

}
