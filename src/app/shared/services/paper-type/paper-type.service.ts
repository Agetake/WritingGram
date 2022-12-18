import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { PaperTypeInterface } from '../../interfaces/paper-type.interface';

@Injectable({
  providedIn: 'root'
})
export class PaperTypeService {

  constructor(
    private afs: AngularFirestore
  ) { }

  // store new paperType in firebase
  create(paperType: PaperTypeInterface): Promise<void> {
    // Return an observable so that we are able to listen for changes from the DB live
    // Adding the fields to the data object
    const queryResult = this.afs
      .collection<PaperTypeInterface>('paperTypes')
      .doc(paperType.id)
      .set(paperType, { merge: true});
    return queryResult;
  }

  // get paper type by id
  getPaperType(paperTypeId: string): Observable<PaperTypeInterface | undefined> {
    return this.afs.doc<PaperTypeInterface>(`paperTypes/${paperTypeId}`).valueChanges();
  }

  // Get all paper types
  getPaperTypes(): Observable<PaperTypeInterface[]> {
    return this.afs.collection<PaperTypeInterface>('paperTypes').valueChanges();
  }
}
