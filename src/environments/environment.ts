// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  useEmulators: false,
  REGION: 'us-central',
  firebase: {
    projectId: 'writing-gram',
    appId: '1:24256737216:web:0985dcb15c7f1851056225',
    storageBucket: 'writing-gram.appspot.com',
    locationId: 'us-central',
    apiKey: 'AIzaSyDkJBTl8ZYUZnwsXlCabJ9R20VJjWT7BDA',
    authDomain: 'writing-gram.firebaseapp.com',
    messagingSenderId: '24256737216',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
