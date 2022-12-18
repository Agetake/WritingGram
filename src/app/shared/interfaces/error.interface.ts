export interface ErrorInterface {
  errorDescription: string;
  time: string;
  event: string;
  errorCode: string;
  url?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorObject?: any; // the error object that has been created
}
