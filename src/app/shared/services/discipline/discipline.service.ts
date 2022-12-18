import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { PaperDisciplineInterface } from '../../interfaces/paper-discipline.interface';

@Injectable({
  providedIn: 'root'
})
export class DisciplineService {

  constructor(
    private afs: AngularFirestore
  ) { }

  // store new discipline in firebase
  create(discipline: PaperDisciplineInterface): Promise<void> {
    // Return an observable so that we are able to listen for changes from the DB live
    // Adding the fields to the data object
    const queryResult = this.afs
      .collection<PaperDisciplineInterface>('disciplines')
      .doc(discipline.id)
      .set(discipline, { merge: true});
    return queryResult;
  }

  // get discipline by id
  getDiscipline(disciplineId: string): Observable<PaperDisciplineInterface | undefined> {
    return this.afs.doc<PaperDisciplineInterface>(`disciplines/${disciplineId}`).valueChanges();
  }

  // Get all disciplines
  getDisciplines(): Observable<PaperDisciplineInterface[]> {
    return this.afs.collection<PaperDisciplineInterface>('disciplines').valueChanges();
  }
}
