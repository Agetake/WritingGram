export class FileUpload {
  id!: string;

  name!: string;

  url!: string;

  file: File;

  uploadedBy!: string;

  deletedBy?: string;

  constructor(file: File) {
    this.file = file;
  }
}
