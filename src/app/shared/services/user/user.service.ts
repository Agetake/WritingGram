import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { PaperInterface } from '../../interfaces/paper.interface';
import { UserInterface } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) { }

  // get user by id
  getUserById(userId: string): Observable<UserInterface | undefined> {
    return this.afs.doc<UserInterface>(`users/${userId}`).valueChanges();
  }

  getCurrentUser():Observable<UserInterface | undefined> {
    return new Observable((subscriber) => {
      try {
        this.afAuth.onAuthStateChanged((authUser) => {
          if (authUser && authUser.email) {
            this.afs.doc<UserInterface>(`users/${authUser.email}`).valueChanges()
            .subscribe((user) => {
              if (user) {
                user.firebaseUid = authUser.uid;
                subscriber.next(user);
              }
            });
          }
        });
      } catch (error) {
        subscriber.error(error);
      }
    });
  }

  // Get all users
  getUsers(): Observable<UserInterface[]> {
    return this.afs.collection<UserInterface>('users', (ref) => ref.where('active', '==', true)).valueChanges();
  }

  // Get user by email
  getUserByEmail(userEmail: string): Observable<UserInterface[]> {
    return this.afs.collection<UserInterface>('users', (ref) => ref.where('active', '==', true) && ref.where('email', '==', userEmail)).valueChanges();
}

  // Sign up with email/password
  SignUp(user: UserInterface, password: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const alreadyExists = await this.afAuth.fetchSignInMethodsForEmail(user.email);
        const newUser = user;
        if (alreadyExists.length < 1) {
          const createdUser = await this.afAuth.createUserWithEmailAndPassword(user.email, password);
          newUser.firebaseUid = createdUser?.user?.uid;
        }
        resolve((await this.createUserInFirebase(newUser)));
      } catch (error) {
        reject(error);
      }
    });
  }

  // store new user in firebase
  createUserInFirebase(user: UserInterface): Promise<void> {
    // Return an observable so that we are able to listen for changes from the DB live
    // Adding the fields to the data object
    const queryResult = this.afs
      .collection<UserInterface>('users')
      .doc(user.id)
      .set(user, { merge: true });
    return queryResult;
  }

  // update new user in firebase
  updateUserInFirebase(user: UserInterface): Promise<void> {
    // Return an observable so that we are able to listen for changes from the DB live
    // Adding the fields to the data object
    const queryResult = this.afs
      .collection<UserInterface>('users')
      .doc(user.id)
      .set(user, { merge: true});
    return queryResult;
  }

  //update users papers
  addPaperToUser(user: UserInterface, paperDetails: PaperInterface): Promise<void> {
    const userDoc: AngularFirestoreDocument<UserInterface> = this.afs.doc<UserInterface>(`users/${user.id}`);
    return userDoc.update({ papers: [paperDetails.id] });
  }

  // Get assigned writer
  getAssignedWriter(paperId: string): Observable<UserInterface[]> {
    // Return an observable so that we are able to listen for changes from the DB live
    return this.afs.collection<UserInterface>('users', (ref) => ref
      .where('papers', 'array-contains-any', [paperId])).valueChanges();
  }

  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }
}
