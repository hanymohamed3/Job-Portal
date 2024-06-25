// EditJobComponent.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../../services/job.service';
import { Job } from '../../interfaces/job';

@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.css']
})
export class EditJobComponent implements OnInit {

  jobId: string = '';
  job: Job | null = null;

  constructor(private route: ActivatedRoute, private jobService: JobService, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.jobId = params.get('id') || ''; // Assign an empty string if jobId is null
      this.getJobDetails();
    });
  }

  getJobDetails() {
    if (this.jobId) {
      this.jobService.getJobById(this.jobId).subscribe((data: Job | undefined) => {
        if (data) {
          // Log the retrieved data and ID
          console.log('Retrieved job data:', data);
          this.job = data;
          this.job.job_id = this.jobId;
          // You can access the ID from the job object itself
          console.log('Retrieved job ID:', data.job_id);
        } else {
          console.error('No job data found for ID:', this.jobId);
        }
      }, (err : any) => {
        console.error('Error fetching job details:', err);
      });
    } else {
      console.error('Invalid job ID:', this.jobId);
    }
  }

  saveChanges() {
    if (this.job) {
      // Update job details in Firebase Firestore
      this.jobService.updateJob(this.job).then(() => {
        alert('Job updated successfully');
        this.router.navigate(["/job-listing"]);
      }).catch(error => {
       alert('Error updating job: '+ error);
      });
    } else {
      console.error('No job data available to update.');
    }
  }
  
}
