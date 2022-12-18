import * as admin from 'firebase-admin';
import { initializeApp, ServiceAccount } from 'firebase-admin';
import { serviceAccount } from '../config/service-acc';

export const firebaseInit = (): typeof initializeApp | undefined => {
  if (!admin.apps.length) {
    const app = admin.initializeApp({ credential: admin.credential.cert(serviceAccount as ServiceAccount) });
    return app as unknown as typeof initializeApp;
  }
  return undefined;
};
