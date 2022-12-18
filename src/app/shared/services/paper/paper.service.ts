import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { arrayUnion } from '@angular/fire/firestore';
import { firstValueFrom, Observable } from 'rxjs';
import { UserInterface } from 'src/app/shared/interfaces/user.interface';
import { PaperInterface } from '../../interfaces/paper.interface';

@Injectable({
  providedIn: 'root'
})
export class PaperService {

  constructor(private afs: AngularFirestore) { }

  // store new paper in firebase
  create(paper: PaperInterface): Promise<void> {
    // Return an observable so that we are able to listen for changes from the DB live
    // Adding the fields to the data object
    const queryResult = this.afs
      .collection<PaperInterface>('papers')
      .doc(paper.id)
      .set(paper, { merge: true});
    return queryResult;
  }

  // store new paper in firebase
  update(paper: PaperInterface): Promise<void> {
    // Return an observable so that we are able to listen for changes from the DB live
    // Adding the fields to the data object
    const queryResult = this.afs
      .collection<PaperInterface>('papers')
      .doc(paper.id)
      .set(paper, {merge: true});
    return queryResult;
  }

  // get paper by id
  getPaper(paperId: string): Observable<PaperInterface | undefined> {
    return this.afs.doc<PaperInterface>(`papers/${paperId}`).valueChanges();
  }

  //get all papers
  getPapers(): Observable<PaperInterface[]> {
    return this.afs.collection<PaperInterface>('papers').valueChanges();
  }

  //get all available order
  getAllAvailablePapers(): Observable<PaperInterface[]> {
    return this.afs.collection<PaperInterface>('papers', (ref) => ref.where('active', '==', true) && ref.where('assigned', '==', false)).valueChanges();
  }

  //get all assigned papers
  getAllAssignedPapers(): Observable<PaperInterface[]> {
    return this.afs.collection<PaperInterface>('papers', (ref) => ref.where('active', '==', true) && ref.where('assigned', '==', true)).valueChanges();
  }

  // get owner of paper
  getPaperOwner(paper: PaperInterface) {
    return this.afs.collection<UserInterface>('users', (ref) => ref.where('active', '==', true) && ref.where('papers', 'array-contains', paper.id)).valueChanges();
  }

  // Get my papers
  async getMyPapers(user: UserInterface): Promise<PaperInterface[] | []> {
    let papers: PaperInterface[] = [];
    if (user.papers && user.papers.length) {
      await Promise.all(user.papers.map(async (paperId) => {
        const paper = await firstValueFrom(this.getPaper(paperId))
        if (paper) {
          !papers.length ? !papers.find((papr) => papr.id === paper.id) ? (papers as PaperInterface[]).push(paper) : '' : papers=[paper];
        }
      }));
    }
    return papers;
  }

  // delete paper in firebase
  delete(paper: PaperInterface): Promise<void> {
    // Return an observable so that we are able to listen for changes from the DB live
    // Adding the fields to the data object
    const queryResult = this.afs
      .collection<PaperInterface>('papers')
      .doc(paper.id)
      .delete();
    return queryResult;
  }
}
