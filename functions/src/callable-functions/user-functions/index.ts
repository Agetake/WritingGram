import * as functions from 'firebase-functions';
import { getAuth } from 'firebase-admin/auth';
import { firebaseInit } from '../../utils/firebase';

firebaseInit()

export const addCustomClaim = functions
    .region('us-east1')
    .https.onCall(async (uid) => {
        try {
          await getAuth()
          .setCustomUserClaims(uid, { admin: true });
          return 'User claim added successfully.'
        } catch (error) {
          return error;
        }
    });


export const fetchCustomClaims = functions
    .region('us-east1')
    .https.onCall(async (uid) => {
    // Lookup the user associated with the specified uid.
    try {
      const userRecord = await getAuth()
      .getUser(uid)
      return userRecord;
    } catch (error) {
      return error;
    }
  });

  export const removeCustomClaim = functions
  .region('us-east1')
  .https.onCall(async (uid) => {
      try {
        await getAuth()
        .setCustomUserClaims(uid, { admin: false });
        return 'User claim removed successfully.'
      } catch (error) {
        return error;
      }
  });

