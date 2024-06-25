import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { Job } from '../../interfaces/job';

@Component({
  selector: 'app-job-applications',
  templateUrl: './job-applications.component.html',
  styleUrls: ['./job-applications.component.css']
})
export class JobApplicationsComponent implements OnInit {

  job: Job | null = null;
  appliedUsers: any[] = []; // Array to store applied users with details

  searchQuery: string = '';
  appliedUsersFiltered: any[] = [];

  constructor(private route: ActivatedRoute, private jobService: JobService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const jobId = params.get('id');
      if (jobId) {
        this.jobService.getJobById(jobId).subscribe(
          (job: Job | undefined) => {
            if (job) {
              this.job = job;
              // Fetch user details for applied users
              this.fetchAppliedUsers();
            } else {
              console.error('Job not found');
            }
          },
          (err: any) => {
            console.error('Error fetching job details:', err);
          }
        );
      } else {
        console.error('Job ID not found in route parameters');
      }
    });

    this.appliedUsersFiltered = this.appliedUsers;
  }

  // Method to fetch user details for applied users
  fetchAppliedUsers() {
    if (this.job && this.job.applied_users) {
      for (const userId of this.job.applied_users) {
        this.authService.getUserById(userId).subscribe(
          (user: any | undefined) => {
            if (user) {
              this.appliedUsers.push(user);
            } else {
              console.error(`User with ID ${userId} not found`);
            }
          },
          (err: any) => {
            console.error(`Error fetching user details for user with ID ${userId}:`, err);
          }
        );
      }
    }
  }
  acceptApplication(user: any){
      if (this.job) {
        const index = this.job.applied_users.indexOf(user.uid);
        if (index !== -1) {
          this.job.applied_users.splice(index, 1);
          this.job.applied_count -= 1;
          this.jobService.updateJob(this.job).then(() => {
            // this.fetchAppliedUsers();
          }).catch(error => {
            console.error('Error updating job :', error);
          });
        } else {
          console.error('User ID not found in applied_users array.');
        }
    }
  }

  showProfile(user: any){
    // this.router.navigate(['/profile']);
    this.router.navigate(['/profile'], { queryParams: { user: JSON.stringify(user) } });
  }

  // Method to filter applied users based on search query
  filterAppliedUsers() {
    if (this.searchQuery.trim() !== '') {
      this.appliedUsersFiltered = this.appliedUsers.filter(user =>
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.contactInfo.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.appliedUsersFiltered = this.appliedUsers;
    }
  }

  rejectApplication(user: any){
    if (window.confirm('Are you sure you want to reject this application?')) {
      if (this.job) {
        const index = this.job.applied_users.indexOf(user.uid);
        if (index !== -1) {
          this.job.applied_users.splice(index, 1);
          this.job.applied_count -= 1;
          this.jobService.updateJob(this.job).then(() => {
            // this.fetchAppliedUsers();
          }).catch(error => {
            console.error('Error updating job after rejecting application:', error);
          });
        } else {
          console.error('User ID not found in applied_users array.');
        }
      }
    }
  }
}
