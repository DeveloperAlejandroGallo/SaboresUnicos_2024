// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { min } from "rxjs";

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyDwZwVh0ylrdZ_QkzMzn0CC58yVdMyZkvQ",
    authDomain: "ajg-pps-2024.firebaseapp.com",
    databaseURL: "https://ajg-pps-2024-default-rtdb.firebaseio.com",
    projectId: "ajg-pps-2024",
    storageBucket: "ajg-pps-2024.appspot.com",
    messagingSenderId: "847994126117",
    appId: "1:847994126117:web:7a02d1aadf97d5265ee4cc",
  },
  apiPushNotificationAndMail: 'https://us-central1-ajg-pps-2024.cloudfunctions.net/app',
  horaApertura: 11,
  minutoApertura: 0,
  horaCierre: 2,
  minutoCierre: 30,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
