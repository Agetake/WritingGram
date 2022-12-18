import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DeadlineRatesInterface } from '../../interfaces/rate.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatesService {

  constructor(
    private afs: AngularFirestore
  ) { }

  // store new rate in firebase
  create(rate: DeadlineRatesInterface): Promise<void> {
    // Return an observable so that we are able to listen for changes from the DB live
    // Adding the fields to the data object
    const queryResult = this.afs
      .collection<DeadlineRatesInterface>('rates')
      .doc(rate.id)
      .set(rate, { merge: true});
    return queryResult;
  }

  // update new rate in firebase
  update(rate: DeadlineRatesInterface): Promise<void> {
    // Return an observable so that we are able to listen for changes from the DB live
    // Adding the fields to the data object
    const queryResult = this.afs
      .collection<DeadlineRatesInterface>('rates')
      .doc(rate.id)
      .set(rate, { merge: true});
    return queryResult;
  }

  // get rate by id
  getRate(rateId: string): Observable<DeadlineRatesInterface | undefined> {
    return this.afs.doc<DeadlineRatesInterface>(`rates/${rateId}`).valueChanges();
  }

  // Get all rates
  getRates(): Observable<DeadlineRatesInterface[]> {
    return this.afs.collection<DeadlineRatesInterface>('rates').valueChanges();
  }
}
