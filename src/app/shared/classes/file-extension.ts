import { FileUploadDialogDataInterface } from "../interfaces/file.interface";

export class FileExtension {

  type: FileUploadDialogDataInterface['type'];


  constructor(type: FileUploadDialogDataInterface['type']) {
    this.type = type;
  }

  extensions(): string[] {
    switch (this.type) {
      case 'essay':
        return ['.DOC', '.DOCX'];
        break;
      case 'sample-essay':
        return ['.DOC', '.DOCX'];
        break;
      case 'paper-material':
        return ['.DOC', '.DOCX', '.PDF', '.JPG', '.PNG', '.JPEG', '.CSV', '.XLSX'];
        break;
      case 'logo':
        return ['.JPG', '.PNG', '.JPEG'];
        break;
      case 'thumbnail':
        return ['.JPG', '.PNG', '.JPEG'];
        break;
      default:
        return ['.DOC'];
        break;
    }
  }
}

