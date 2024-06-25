import { Component } from '@angular/core';
import { Job } from '../../interfaces/job';
import { AuthService } from '../../services/auth.service';
import { JobService } from '../../services/job.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-job-listing',
  templateUrl: './job-listing.component.html',
  styleUrl: './job-listing.component.css'
})
export class JobListingComponent {

  jobs_list: Job[] = [];

  filteredJobs: Job[] = [];
  userRole$!: Observable<string | null>;
  searchTerm: string = '';  
  currentUserID: string = '';
  countryFilter: string = '';


  constructor(private jobData: JobService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {

    this.userRole$ = this.authService.getCurrentUserRole();
    // Fetch all jobs when the component initializes
    this.getAllJobs();
    // Fetch the current user's data when the component initializes
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUserID = user.uid;
    });
  }

  getAllJobs() {
    this.jobData.getAllJobs().subscribe(res => {
      this.jobs_list = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.job_id = e.payload.doc.id;
        return data;
      });
      // Initially, set filteredJobs to contain all jobs
      this.filteredJobs = this.jobs_list;
    }, err => {
      console.error('Error while fetching jobs data:', err);
      alert('Error while fetching jobs data.');
    });
  }

  postJob() {
    this.router.navigate(["/create-job"]);
  }

  // Update / edit job
  editJob(job: Job) {
    this.router.navigate(['/edit-job', job.job_id]);
  }

  viewJob(job: Job) {
    this.router.navigate(['/job-details', job.job_id]);
  }

  deleteJob(job: Job) {
    if (window.confirm('Are you sure you want to delete' + ' ( ' + job.job_title + ' ) job ?')) {
      this.jobData.deleteJob(job);
    }
  }

  ApplyForJob(job: Job) {
    if (job) {
      if (!job.applied_users) {
        // If applied_users array doesn't exist, initialize it as an empty array
        job.applied_users = [];
      }
      // Check if the user's email is not already in the applied_users array
      if (!job.applied_users.includes(this.currentUserID)) {
        job.applied_users.push(this.currentUserID);
        job.applied_count += 1;
      }
      this.jobData.updateJob(job).then(() => {
        alert('Applied successfully, pending for company approval.');
      }).catch(error => {
        alert('Error applying job: ' + error);
      });
    }
  }
  checkJobApplStatus(job: Job){
    return job.applied_users.includes(this.currentUserID);
  }

  filterJobs() {
    this.filteredJobs = this.jobs_list.filter(job =>
      (job.job_title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      job.job_type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      job.job_description.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (job.country.toLowerCase().includes(this.countryFilter.toLowerCase()) || // Apply country filter
      this.countryFilter === '') // Handle case when no country filter is applied
    );
  }
  
  

  puaseJob(job: Job) {
    job.puased = true;
    this.jobData.updateJob(job).then(() => {
      alert('job Puased successfully');
    }).catch(error => {
      alert('Error pausing a job: ' + error);
    });
  }
  unPuaseJob(job: Job){
    job.puased = false;
    this.jobData.updateJob(job).then(() => {
      alert('job UnPuased successfully');
    }).catch(error => {
      alert('Error Unpausing a job: ' + error);
    });
  }
  
  viewJobApplications(job: Job){
    this.router.navigate(["/job-applications", job.job_id]);
  }
}
