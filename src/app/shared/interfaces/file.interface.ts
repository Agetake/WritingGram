import { UserInterface } from "./user.interface";

export interface FileInterface {
  id: string,
  name: string,
  downloadUrl: string,
  type?: string,
  uploadedBy: UserInterface,
  original_filename?: string; //The original name of the file that was uploaded
  filePath?: string;
  approved: boolean;
  uploadedOn: string;
}

export interface FileUploadDialogDataInterface {
  type: 'video' | 'logo' | 'thumbnail' | 'essay' | 'paper-material' | 'profile-pic' | 'sample-essay',
  filePath: string;
}


export interface SupportedFileTypeInterface {
  type: FileUploadDialogDataInterface,
  extensions: string[],
}

export interface UploadedFileInterface {
  id: string;
  name: string;
  file: File;
  filePath: string;
  downloadUrl: string;
  type: string;
  uploadedBy: UserInterface;
  originalFileName: string;
  approved: boolean;
}
