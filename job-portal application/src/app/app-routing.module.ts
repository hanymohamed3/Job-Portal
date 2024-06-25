import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { JobListingComponent } from './components/job-listing/job-listing.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { CreateJobComponent } from './components/create-job/create-job.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditJobComponent } from './components/edit-job/edit-job.component';
import { SavedJobsComponent } from './components/saved-jobs/saved-jobs.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { JobApplicationsComponent } from './components/job-applications/job-applications.component';
import { CompanyProfileComponent } from './components/company-profile/company-profile.component';
import { AuthGuard } from './services/guards/auth.guard';
import { NoAuthGuardService } from './services/guards/no-auth-guard.service';
const routes: Routes = [
  {path: '', redirectTo: 'home-page', pathMatch: 'full'},
  {path: 'home-page', component: HomePageComponent, canActivate: [NoAuthGuardService]}, 
  {path: 'login', component: LoginComponent, canActivate: [NoAuthGuardService]},
  {path: 'register', component: RegisterComponent, canActivate: [NoAuthGuardService]},
  {path: 'job-listing', component: JobListingComponent, canActivate: [AuthGuard]},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'create-job', component: CreateJobComponent, canActivate: [AuthGuard]},
  {path: 'job-details/:id', component: JobDetailsComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'edit-job/:id', component: EditJobComponent, canActivate: [AuthGuard]},
  {path: 'saved-jobs', component: SavedJobsComponent, canActivate: [AuthGuard]},
  {path: 'job-applications/:id', component: JobApplicationsComponent, canActivate: [AuthGuard]},
  {path: 'company-profile', component: CompanyProfileComponent, canActivate: [AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
