import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { JobListingComponent } from './components/job-listing/job-listing.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import {AngularFireModule} from '@angular/fire/compat'
import { environment } from '../environments/environment';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CreateJobComponent } from './components/create-job/create-job.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditJobComponent } from './components/edit-job/edit-job.component';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { SavedJobsComponent } from './components/saved-jobs/saved-jobs.component';
import { JobApplicationsComponent } from './components/job-applications/job-applications.component';
import { CompanyProfileComponent } from './components/company-profile/company-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    JobListingComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    CreateJobComponent,
    JobDetailsComponent,
    ProfileComponent,
    EditJobComponent,
    SavedJobsComponent,
    JobApplicationsComponent,
    CompanyProfileComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp({"projectId":"job-portal-96ffe","appId":"1:294991616886:web:e4bf623df2dce933367857","storageBucket":"job-portal-96ffe.appspot.com","apiKey":"AIzaSyChyWnTkvRGfuipjxCj_rkJVPohBxWdu14","authDomain":"job-portal-96ffe.firebaseapp.com","messagingSenderId":"294991616886"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
    ,
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    provideStorage(() => getStorage()),
  ],
  providers: [
    provideClientHydration(),
    AngularFirestore,
    AngularFireStorageModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
