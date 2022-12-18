import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { LevelInterface } from '../../interfaces/level.interface';

@Injectable({
  providedIn: 'root'
})
export class LevelService {

  constructor(
    private afs: AngularFirestore
  ) { }

  // store new level in firebase
  create(level: LevelInterface): Promise<void> {
    // Return an observable so that we are able to listen for changes from the DB live
    // Adding the fields to the data object
    const queryResult = this.afs
      .collection<LevelInterface>('levels')
      .doc(level.id)
      .set(level, { merge: true});
    return queryResult;
  }

  // get level by id
  getLevel(levelId: string): Observable<LevelInterface | undefined> {
    return this.afs.doc<LevelInterface>(`levels/${levelId}`).valueChanges();
  }

  // Get all levels
  getLevels(): Observable<LevelInterface[]> {
    return this.afs.collection<LevelInterface>('levels').valueChanges();
  }
}
