import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  email: string = '';
  constructor(private fireauth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) {
  }

  //login 
  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(res => {
      localStorage.setItem('token', 'true');

      this.router.navigate(['/job-listing']);

      this.email = email;

      // if (res.user?.emailVerified == true){
      //   this.router.navigate(['/jobs']);
      // }else {
      //   this.router.navigate(['/verify-email']);
      // }
    }, err => {
      alert('Something Went Wrong');
      this.router.navigate(['/login']);
    });
  }

  // Register
  register(email: string, password: string, role: string = 'jobSeeker', additionalInfo?: any) {
    this.fireauth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        if (userCredential && userCredential.user) {
          // Add user to Firestore with specified or default role and additional info
          let userData: any = {
            role: role
          };
          if (additionalInfo) {
            userData = { ...userData, ...additionalInfo };
          }
          return this.firestore.collection('users').doc(userCredential.user.uid).set(userData);
        } else {
          throw new Error('User credential or user is null.');
        }
      })
      .then(() => {
        alert('Registration Successful');
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.error('Registration error:', error);
        alert(error.message);
      });
  }

  // logout
  logout() {
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);

    })
  }

  isLoggedIn(): Observable<boolean> {
    return this.fireauth.authState.pipe(map(user => !!user));
  }

  // forgot password
  showVerificationMessage: boolean = false;
  forgotPassword(email: string): Promise<void> {
    return this.fireauth.sendPasswordResetEmail(email).then(() => {
      // this.router.navigate(['/verify-email']);
      this.showVerificationMessage = true;
    }, err => {
      alert('Something went wrong!');
    });

  }

  // email verification
  // SendEmailForVerification(user: any) {
  //   user.SendEmailForVerification().then((res: any) => {
  //     this.router.navigate(['/verify-email']);
  //   }, (err: any) => {
  //     alert('Something went wrong, Not able to send mail to your email.');
  //   })
  // }


  // Get User Role
  getCurrentUserRole(): Observable<string | null> {
    return this.fireauth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.doc<any>(`users/${user.uid}`).valueChanges().pipe(
            map((userData: { role: any; }) => userData.role)
          );
        } else {
          return of(null);
        }
      })
    );
  }

  // Get User Email
  getCurrentUserEmail(): Observable<string | null> {
    return this.fireauth.authState.pipe(
      switchMap(user => {
        if (user) {
          return of(user.email); // Return user's email
        } else {
          return of(null);
        }
      })
    );
  }

  // Get Current User
  getCurrentUser(): Observable<any> {
    return this.fireauth.authState.pipe(
      switchMap(user => {
        if (user) {
          const userData$ = this.firestore.doc<any>(`users/${user.uid}`).valueChanges();
          return userData$.pipe(
            map(userData => ({ ...userData, uid: user.uid })) // Include uid in the userData object
          );
        } else {
          return of(null);
        }
      })
    );
  }


  // Update user data
  updateUser(uid: string, userData: any): Promise<void> {
    return this.firestore.collection('users').doc(uid).update(userData);
  }


  // Get user by ID
  getUserById(userId: string): Observable<any> {
    return this.firestore.collection('users', ref => ref.where(firebase.firestore.FieldPath.documentId(), '==', userId))
      .valueChanges({ idField: 'uid' }).pipe(
        map(users => users[0]), // Assume there's only one user with the given ID
        catchError(error => {
          console.error('Error fetching user details:', error);
          return of(null);
        })
      );
  }
}
