import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Job } from '../interfaces/job';
import { join } from 'path';
import { Observable, from, map } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private angulare_fire_store: AngularFirestore) { }

  // add job
  async addJob(job: Job): Promise<void> {
    try {
      const docRef = await this.angulare_fire_store.collection('jobs').add(job);
      await docRef.update({ job_id: docRef.id });
    } catch (error) {
      throw new Error('Failed to add job: ' + error);
    }
  }
  // get all jobs / job list
  getAllJobs() {
    return this.angulare_fire_store.collection('/jobs').snapshotChanges();
  }

  // delete job
  deleteJob(job: Job) {
    return this.angulare_fire_store.doc('/jobs/' + job.job_id).delete();
  }

  // Edit job  (update)
  updateJob(job: Job): Promise<void> {
    const { job_id, ...jobData } = job; // Exclude job_id from the data to be updated
    return this.angulare_fire_store.doc(`jobs/${job_id}`).update(jobData);
  }  

  unsaveJob(userData: any, job: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        if (userData.uid) {
          const userDocRef = this.angulare_fire_store.collection('users').doc(userData.uid);
          userDocRef.update({
            savedJobs: firebase.firestore.FieldValue.arrayRemove(job.job_id)
          })
          .then(() => {
            resolve(); // Resolve the promise when update is successful
          })
          .catch(error => {
            console.error('Error un-saving job:', error);
            reject(error); // Reject the promise if an error occurs
          });
        }
      } catch (error) {
        console.error('Error un-saving job:', error);
        reject(error); // Reject the promise if an error occurs
      }
    });
  }
    // get job by ID
    getJobById(jobId: string): Observable<Job> {
      return this.angulare_fire_store.doc(`/jobs/${jobId}`).snapshotChanges().pipe(
        map(action => {
          const data = action.payload.data() as Job;
          const id = action.payload.id;
          return { id, ...data };
        })
      );
    }
}
