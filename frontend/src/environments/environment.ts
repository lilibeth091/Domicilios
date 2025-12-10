// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { url } from "inspector";

export const environment = {
  production: false,
  url_backend:'https://44202382-5f5c-43c5-a919-7bc16c69c1ef.mock.pstmn.io',
  url_ms_security:'https://db0ee2e7-2a77-41be-b95f-cdc534d6fc8e.mock.pstmn.io',
  url_web_socket:'https://0.0.0.0:5000'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
